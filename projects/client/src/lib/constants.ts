export const PROTECTED_CDN_URL = (() => {
  const url = new URL(process.env.PROTECTED_CDN_URL as string);
  url.pathname = "/protected";
  return url.toString();
})();
