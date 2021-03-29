import { ServerRequest, Response } from "./deps.ts";

type ResponseWithHeaders = Response & Required<Pick<Response, "headers">>;

export type HttpMiddleware = (
  request: ServerRequest,
  response: Response & ResponseWithHeaders
) => void;
