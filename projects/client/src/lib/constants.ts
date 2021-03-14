export const STATIC_CDN_URL = (() => {
  const url = new URL(process.env.STATIC_CDN_URL as string);
  url.pathname = "/protected";
  return url.toString();
})();
