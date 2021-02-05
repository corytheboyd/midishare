/**
 * TODO actually recover from this or something. Maybe implement similar
 *  methods, like ForbiddenError.
 * */
export class NotFoundError extends Error {
  constructor() {
    super("Not found");
  }
}
