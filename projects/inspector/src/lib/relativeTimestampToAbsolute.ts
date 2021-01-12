import formatISO from "date-fns/formatISO";

let baseTime: number;

/**
 * @param {number} timestamp High resolution timestamp (ms)
 * */
export function relativeTimestampToAbsolute(timestamp: number): string {
  if (!baseTime) {
    baseTime = new Date().getTime() - performance.now();
  }
  return formatISO(new Date(baseTime + timestamp));
}
