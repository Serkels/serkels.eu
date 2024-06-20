//

import Bowser from "bowser";
import { useMemo } from "react";

//

export function useUserAgent() {
  return useMemo(
    () => Bowser.getParser(window.navigator.userAgent),
    [window.navigator.userAgent],
  );
}

export const PLATFORMS_MAP = {
  tablet: "tablet",
  mobile: "mobile",
  desktop: "desktop",
  tv: "tv",
  bot: "bot",
} as const;
