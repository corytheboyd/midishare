export const PROTECTED_CDN_URL = (() => {
  const url = new URL(process.env.CDN_URL as string);
  url.pathname = "/protected";
  return url.toString();
})();
