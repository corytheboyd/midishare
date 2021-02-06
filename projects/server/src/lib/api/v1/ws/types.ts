export type WSSubType = "sessionData";

export type WSSubData = {
  type: WSSubType;
  sessionId?: string;
};
