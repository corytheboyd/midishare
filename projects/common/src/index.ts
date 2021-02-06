/**
 * Corresponds to a User's OpenID dub value
 *
 * @see https://openid.net/specs/openid-connect-core-1_0.html#IDToken
 * */
export type UserId = string;

/**
 * ISO8601 DateTime string
 * */
export type DateTime = string;

export type UserProfile = {
  sub: UserId;
  name: string;
  picture: string;
  email: string;
};

export type Session = {
  id: string;
  createdAt: DateTime;
  updatedAt: DateTime;
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
}

export interface WebSocketSubTypeArgs
  extends Record<string | number | symbol, unknown> {
  type: WebSocketSubType;
}

export interface SessionDataWebSocketArgs extends WebSocketSubTypeArgs {
  type: WebSocketSubType.SESSION_DATA;
  sessionId: string;
}
