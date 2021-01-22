/**
 * Shamelessly based off of:
 * https://github.com/mattdesl/lerp/blob/master/index.js
 * */
export function lerp(v0: number, v1: number, t: number): number {
  return v0 * (1 - t) + v1 * t;
}
