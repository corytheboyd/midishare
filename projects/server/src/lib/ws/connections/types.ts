/**
 * @see https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent#status_codes
 * */
export enum CloseCode {
  NORMAL_CLOSURE = 1000,
  GOING_AWAY = 1001,
  INTERNAL_ERROR = 1011,
  SERVICE_RESTART = 1012,
  TRY_AGAIN_LATER = 1013,
  BAD_GATEWAY = 1014,
}
