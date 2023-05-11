//

import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetUno,
  presetWebFonts,
} from "unocss";

//

export default defineConfig({
  presets: [
    presetUno({ attributifyPseudo: true }),
    presetAttributify({ strict: true, prefix: "un-", prefixedOnly: true }),
    presetWebFonts({ provider: "google", fonts: { sans: "Mukta" } }),
    presetIcons({
      scale: 1.2,
      cdn: "https://esm.sh/",
    }),
  ],
});
