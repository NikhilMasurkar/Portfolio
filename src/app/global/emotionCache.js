import createCacheImport from "@emotion/cache";

const createCache = createCacheImport.default ?? createCacheImport;

export default function createEmotionCache() {
  const cache = createCache({ key: "nm", prepend: true });

  cache.compat = true;
  const insert = cache.insert.bind(cache);
  cache.insert = (selector, serialized, sheet, shouldCache) => {
    if (!serialized.styles.startsWith("@layer")) {
      serialized = { ...serialized, styles: `@layer mui{${serialized.styles}}` };
    }
    return insert(selector, serialized, sheet, shouldCache);
  };

  return cache;
}
