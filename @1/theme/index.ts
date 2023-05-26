//

import { FileSystemIconLoader } from "@iconify/utils/lib/loader/node-loaders";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { Preflight } from "unocss";
import {
  presetAttributify,
  presetIcons,
  presetUno,
  presetWebFonts,
  type Preset,
  type Rule,
  type UserConfig,
  type UserShortcuts,
} from "unocss";

//

const theme = {
  img: {
    brand: {
      rainbow: "linear-gradient(52deg, #04AAE8 0%, #782D8E 46%, #C91489 100%)",
    },
  },
};
type Theme = typeof theme;

//

const preflights: Preflight<Theme>[] = [
  {
    getCSS() {
      return `:root {
        --brand-rainbow: linear-gradient(52deg, #04AAE8 0%, #782D8E 46%, #C91489 100%)
      }`;
    },
  },
];

const rules: Rule<Theme>[] = [];
const shortcuts: UserShortcuts<Theme> = [];
const presets: Preset<any>[] = [
  presetUno({ attributifyPseudo: true }),
  presetAttributify({ strict: true, prefix: "un-", prefixedOnly: true }),
  presetWebFonts({ provider: "google", fonts: {} }),
  presetIcons({
    scale: 1.2,
    cdn: "https://esm.sh/",
    collections: {
      test: {
        circle:
          '<svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="50"></circle></svg>',
      },
      brand: FileSystemIconLoader(
        join(dirname(fileURLToPath(import.meta.url)), "./icons")
      ),
    },
  }),
];

//

export const config: UserConfig<Theme> = {
  preflights,
  presets,
  rules,
  shortcuts,
  theme,
};
