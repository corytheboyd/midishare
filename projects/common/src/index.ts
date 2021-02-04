/**
 * Corresponds to a User's OpenID dub value
 *
 * @see https://openid.net/specs/openid-connect-core-1_0.html#IDToken
 * */
type UserId = string;

export type UserProfile = {
  sub: UserId;
  name: string;
  picture: string;
  email: string;
};

export type Session = {
  /**
   * Unique ID of the Session. Used to join the session with.
   * */
  id: string;

  /**
   * Participants in the session
   * */
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
