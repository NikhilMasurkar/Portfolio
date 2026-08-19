import createCacheImport from "@emotion/cache";
import createEmotionServerImport from "@emotion/server/create-instance";

const createCache = createCacheImport.default ?? createCacheImport;

export default function createEmotionCache() {
  return createCache({ key: "nm", prepend: true });
}

const createEmotionServer =
  createEmotionServerImport.default ?? createEmotionServerImport;

export function emotionServer(cache) {
  return createEmotionServer(cache);
}
