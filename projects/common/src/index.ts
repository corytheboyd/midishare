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
