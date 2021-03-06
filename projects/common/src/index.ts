/**
 * Corresponds to a User's OpenID dub value
 *
 * @see https://openid.net/specs/openid-connect-core-1_0.html#IDToken
 * */
export type UserId = string;

export type UserProfile = {
  sub: UserId;
  name: string;
  picture: string;
  email: string;
};

export type SessionRuntimeOptions = {
  sustainInverted: boolean;
};

export type Session = {
  id: string;
  participants: {
    /**
     * The host is the peer that created the Session
     * */
    host: UserId;

    /**
     * The guest is the peer that is joining the host's session. Undefined
     * until the guest joins the session!
     * */
    guest?: UserId;
  };
  runtimeOptions: {
    host: SessionRuntimeOptions;
    guest: SessionRuntimeOptions;
  };
};

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent#status_codes
 * */
export enum WebSocketCloseCode {
  NORMAL_CLOSURE = 1000,
  GOING_AWAY = 1001,
  INTERNAL_ERROR = 1011,
  SERVICE_RESTART = 1012,
  TRY_AGAIN_LATER = 1013,
  BAD_GATEWAY = 1014,
}

export enum WebSocketSubType {
  SESSION_DATA = "sessionData",
  SIGNALING = "signaling",
}

export type WebSocketSessionDataArgs = {
  sessionId: string;
};

export type WebSocketSignalingArgs = {
  sessionId: string;
};

export type WebSocketSubTypeArgs = { type: WebSocketSubType } & (
  | WebSocketSessionDataArgs
  | WebSocketSignalingArgs
);

export type SignalingMessage = {
  /**
   * JSON serialized RTCSessionDescription
   * */
  description?: string;

  /**
   * JSON serialized RTCIceCandidate
   * */
  candidate?: string;
};
