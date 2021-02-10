import { SignalingMessage } from "@midishare/common";
import { Socket } from "../ws/Socket";

export class PeerConnection {
  private static _instance: PeerConnection | null;

  private readonly pc: RTCPeerConnection;

  private midiDataChannel?: RTCDataChannel;
  private signaling?: Socket;
  private polite: boolean | null = null;
  private makingOffer = false;
  private ignoreOffer = false;

  public static instance(): PeerConnection {
    if (!this._instance) {
      this._instance = new this();
    }
    return this._instance;
  }

  public static destroy(): void {
    this._instance?.pc.close();
    this._instance = null;
  }

  public static sendMidiData(data: Uint8Array, timestamp: number): void {
    const message: (string | number)[] = [timestamp.toFixed(3)];
    for (const value of data) {
      message.push(value);
    }
    this._instance?.midiDataChannel?.send(message.join(","));
  }

  private constructor() {
    this.pc = this.createPeerConnection();
  }

  public start(): void {
    if (this.polite === null) {
      throw new Error("PeerConnection: failed to start, must call setPolite");
    }
    this.midiDataChannel = this.createMidiDataChannel();
  }

  public setPolite(value: boolean): void {
    this.polite = value;
  }

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

  private createMidiDataChannel(): RTCDataChannel {
    const dc = this.pc.createDataChannel("MIDI", {
      id: 0,
      negotiated: true,
      ordered: false,
      priority: "high",
    });

    dc.onmessage = (event) => {
      console.debug("PeerConnection: midi data received", event.data);
      // this.onMidiMessage(event.data);
    };

    return dc;
  }

  private createPeerConnection(): RTCPeerConnection {
    const pc = new RTCPeerConnection();

    pc.onnegotiationneeded = async () => {
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

    pc.ondatachannel = (event) => {
      console.debug(
        "PeerConnection: remote peer added data channel",
        event.channel
      );
    };

    pc.onconnectionstatechange = () => {
      console.debug(
        "PeerConnection: connection state change",
        pc.connectionState
      );
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
