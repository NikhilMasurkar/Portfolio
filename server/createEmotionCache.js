import createEmotionServerImport from "@emotion/server/create-instance";

export { default } from "../src/app/global/emotionCache.js";

/**
 * Same CommonJS unwrap @emotion/cache needs, and for the same reason: getting
 * it wrong throws inside handleRender, where the catch turns it into a silent
 * fallback to the empty SPA shell — perfect in a browser, blank to crawlers.
 */
const createEmotionServer =
  createEmotionServerImport.default ?? createEmotionServerImport;

export function emotionServer(cache) {
  return createEmotionServer(cache);
}
