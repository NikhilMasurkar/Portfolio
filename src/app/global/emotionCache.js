import createCacheImport from "@emotion/cache";

const createCache = createCacheImport.default ?? createCacheImport;

export default function createEmotionCache() {
  /*
   * NO `prepend: true`. It puts Emotion's <style> tags at the very top of
   * <head> — ahead of index.html's `@layer` order declaration — and a layer's
   * position is fixed the first time the browser sees its name. Emotion's
   * `@layer mui{...}` parsing first registered `mui` as the lowest layer,
   * under Tailwind's Preflight, whose `*{padding:0}` then stripped the padding
   * from every input and collapsed the contact form's fields to a sliver.
   * The layer order is what decides precedence now, not the tag order.
   */
  const cache = createCache({ key: "nm" });

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
