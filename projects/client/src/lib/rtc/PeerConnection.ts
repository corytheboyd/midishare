import { SignalingMessage } from "@midishare/common";
import { Socket } from "../ws/Socket";

export class PeerConnection {
  private static _instance: PeerConnection | null;

  private pc: RTCPeerConnection | null = null;
  private midiDataChannel: RTCDataChannel | null = null;
  private polite: boolean | null = null;
  private originalPolite: boolean | null = null;
  private onMidiDataCallbacks: ((data: number[]) => void)[] = [];

  private signaling?: Socket;
  private makingOffer = false;
  private ignoreOffer = false;

  public static instance(): PeerConnection {
    if (!this._instance) {
      this._instance = new this();
    }
    return this._instance;
  }

  /**
   * TODO this will not work when using more than one instance of the
   *  userPeerConnection hook. Need to only destroy instance if the last hook
   *  is going away.
   * */
  public static destroy(): void {
    this._instance?.resetPeerConnection(false);
    this._instance = null;
  }

  /**
   * Sends MIDI data to other peer through the underlying PeerConnection
   * singleton.
   *
   * If we're in a reconnection like state where the underlying data channel
   * doesn't exist yet, the message is simply dropped. It doesn't really make
   * a whole lot of sense to queue up and replay realtime data.
   * */
  public static sendMidiData(data: Uint8Array, timestamp: number): void {
    const message: (string | number)[] = [timestamp];
    for (const value of data) {
      message.push(value);
    }
    if (this._instance?.midiDataChannel?.readyState === "open") {
      this._instance?.midiDataChannel?.send(message.join(","));
    }
  }

  private constructor() {
    this.pc = this.createPeerConnection();
  }

  public start(): void {
    if (this.polite === null) {
      throw new Error("PeerConnection: failed to start, must call setPolite");
    }
    console.debug("PeerConnection: start");
    this.addMidiDataChannelToConnection();
  }

  public setPolite(value: boolean): void {
    if (this.originalPolite === null) {
      this.originalPolite = value;
    }
    console.debug("PeerConnection: set polite", value);
    this.polite = value;
  }

  public onMidiData(cb: (data: number[]) => void): void {
    this.onMidiDataCallbacks.push(cb);
  }

  /**
   * While public, this shouldn't be interacted with. It's called by the
   * usePeerConnection hook, which creates a signaling socket and assigns
   * it with this function automatically.
   * */
  public setSignaling(socket: Socket): void {
    this.signaling = socket;

    this.signaling.onMessage((data) => {
      let message: SignalingMessage;
      try {
        message = JSON.parse(data);
      } catch (error) {
        return;
      }
      this.processSignaling(message);
    });
  }

  private addMidiDataChannelToConnection(): void {
    if (!this.pc) {
      throw new Error("PeerConnection: pc not set");
    }
    if (this.midiDataChannel) {
      throw new Error("PeerConnection: midi data channel already added");
    }

    const dc = this.pc.createDataChannel("MIDI", {
      id: 0,
      negotiated: true,
      ordered: false,
    });
    this.midiDataChannel = dc;

    dc.onopen = () => {
      console.debug("PeerConnection: midi data channel open");
    };

    dc.onclose = async () => {
      console.debug("PeerConnection: midi data channel closed, destroying");

      // TODO this likely isn't the right place to put it, what if there were
      //  more data channels?
      this.resetPeerConnection();
    };

    dc.onmessage = (event) => {
      this.onMidiDataCallbacks.forEach((cb) => cb(event.data));
    };
  }

  private resetPeerConnection(create = true): void {
    console.debug("PeerConnection: restart", create);

    if (this.midiDataChannel) {
      this.midiDataChannel.close();
      this.midiDataChannel.onopen = null;
      this.midiDataChannel.onclose = null;
      this.midiDataChannel.onmessage = null;
    }
    this.midiDataChannel = null;

    if (this.pc) {
      this.pc.close();
      this.pc.onnegotiationneeded = null;
      this.pc.onicecandidate = null;
      this.pc.oniceconnectionstatechange = null;
      this.pc.onconnectionstatechange = null;
    }
    this.pc = null;

    // If this was the impolite peer, and it is restarting, temporarily switch to polite to accept the offer
    if (!this.polite) {
      this.setPolite(true);
    }

    if (create) {
      this.pc = this.createPeerConnection();
      this.start();
    }
  }

  private createPeerConnection(): RTCPeerConnection {
    const pc = new RTCPeerConnection();

    pc.onnegotiationneeded = async () => {
      console.debug("PeerConnection: negotiation needed");

      this.makingOffer = true;
      try {
        await (pc as typeof pc & {
          setLocalDescription: () => Promise<void>;
        }).setLocalDescription();

        this.sendSignaling({
          description: JSON.stringify(pc.localDescription),
        });
      } catch (err) {
        console.error("RTC: error sending initial offer", err);
      } finally {
        this.makingOffer = false;
      }
    };

    pc.onicecandidate = async (event) => {
      if (!event.candidate) {
        return;
      }
      this.sendSignaling({
        candidate: JSON.stringify(event.candidate),
      });
    };

    pc.onsignalingstatechange = () => {
      console.debug(
        "PeerConnection: signaling state change",
        pc.signalingState
      );
    };

    pc.oniceconnectionstatechange = () => {
      console.debug(
        "PeerConnection: ice connection state change",
        pc.iceConnectionState
      );

      // See: https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/restartIce
      // TODO actually test to figure out if it works first
      // TODO fix types
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      // this.pc.restartIce();
    };

    pc.onconnectionstatechange = () => {
      console.debug(
        "PeerConnection: connection state change",
        pc.connectionState
      );

      if (pc.connectionState === "connecting") {
        if (this.polite !== this.originalPolite) {
          console.debug("PeerConnection: reverting polite after reconnect");
          this.setPolite(this.originalPolite!);
        }
      }
    };

    return pc;
  }

  private sendSignaling(message: SignalingMessage): void {
    if (!this.signaling) {
      throw new Error("PeerConnection: signaling socket not set");
    }
    console.debug("PeerConnection: send signaling", message);
    this.signaling.send(JSON.stringify(message));
  }

  private async processSignaling(message: SignalingMessage): Promise<void> {
    if (!this.pc) {
      throw new Error("PeerConnection: pc not set");
    }
    if (!this.signaling) {
      throw new Error("PeerConnection: signaling socket not set");
    }

    console.debug("PeerConnection: received signaling", message);

    if (message.candidate) {
      const candidate: RTCIceCandidateInit = JSON.parse(message.candidate);
      try {
        await this.pc.addIceCandidate(candidate);
      } catch (err) {
        if (!this.ignoreOffer) {
          throw err;
        }
      }
    }

    if (message.description) {
      const description: RTCSessionDescriptionInit = JSON.parse(
        message.description
      );

      const offerCollision =
        description.type === "offer" &&
        (this.makingOffer || this.pc.signalingState !== "stable");

      this.ignoreOffer = !this.polite && offerCollision;
      if (this.ignoreOffer) {
        return;
      }

      await this.pc.setRemoteDescription(description);
      if (description.type === "offer") {
        // TODO fix setLocalDescription typing
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        await this.pc.setLocalDescription();

        this.sendSignaling({
          description: JSON.stringify(this.pc.localDescription),
        });
      }
    }
  }
}
