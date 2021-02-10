import { SignalingMessage } from "@midishare/common";
import { Socket } from "../ws/Socket";

export class PeerConnection {
  private static _instance: PeerConnection;

  private readonly peerConnection: RTCPeerConnection;
  private readonly midiDataChannel: RTCDataChannel;

  private signaling?: Socket;
  private polite?: boolean;
  private makingOffer = false;
  private ignoreOffer = false;

  public static instance(): PeerConnection {
    if (!this._instance) {
      this._instance = new this();
    }
    return this._instance;
  }

  public static destroy(): void {
    this._instance.peerConnection.close();
  }

  public static async processSignalingMessage(
    message: SignalingMessage
  ): Promise<void> {
    return this._instance.processSignaling(message);
  }

  public static sendMidiData(data: Uint8Array, timestamp: number): void {
    const message: (string | number)[] = [timestamp.toFixed(3)];
    for (const value of data) {
      message.push(value);
    }
    this.instance().midiDataChannel.send(message.join(","));
  }

  private constructor() {
    this.peerConnection = this.createPeerConnection();
    this.midiDataChannel = this.createMidiDataChannel();
  }

  public setPolite(value: boolean): void {
    this.polite = value;
  }

  public setSignaling(socket: Socket): void {
    this.signaling = socket;
  }

  private createMidiDataChannel(): RTCDataChannel {
    const dc = this.peerConnection.createDataChannel("MIDI", {
      id: 0,
      negotiated: true,
      ordered: false,
      priority: "high",
    });

    dc.onmessage = (event) => {
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
        console.error("RTC: error sending initial offer");
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
      console.debug("RTC: remote peer added data channel", event.channel);
    };

    return pc;
  }

  private sendSignaling(message: SignalingMessage): void {
    if (!this.signaling) {
      throw new Error("PeerConnection: signaling socket not set");
    }
    this.signaling.send(JSON.stringify(message));
  }

  private async processSignaling(message: SignalingMessage): Promise<void> {
    if (!this.signaling) {
      throw new Error("PeerConnection: signaling socket not set");
    }

    if (message.candidate) {
      const candidate: RTCIceCandidateInit = JSON.parse(message.candidate);
      try {
        await this.peerConnection.addIceCandidate(candidate);
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
        (this.makingOffer || this.peerConnection.signalingState !== "stable");

      this.ignoreOffer = !this.polite && offerCollision;
      if (this.ignoreOffer) {
        return;
      }

      await this.peerConnection.setRemoteDescription(description);
      if (description.type === "offer") {
        // TODO fix setLocalDescription typing
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        await peerConnection.setLocalDescription();

        this.sendSignaling({
          description: JSON.stringify(this.peerConnection.localDescription),
        });
      }
    }
  }
}
