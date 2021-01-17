import format from "date-fns/format";

let baseTime: number;

/**
 * @param {number} timestamp High resolution timestamp (ms)
 * */
export function relativeTimestampToAbsolute(timestamp: number): string {
  if (!baseTime) {
    baseTime = new Date().getTime() - performance.now();
  }
  return format(new Date(baseTime + timestamp), "yyyy-MM-dd HH:mm:ss.SSSS");
}
