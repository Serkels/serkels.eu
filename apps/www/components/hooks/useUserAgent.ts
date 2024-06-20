//

import Bowser, { PLATFORMS_MAP as BOWSER_PLATFORMS_MAP } from "bowser";
import { useMemo } from "react";

//

export function useUserAgent() {
  return useMemo(
    () => Bowser.getParser(window.navigator.userAgent),
    [window.navigator.userAgent],
  );
}

export const PLATFORMS_MAP = BOWSER_PLATFORMS_MAP as Readonly<{
  tablet: "tablet";
  mobile: "mobile";
  desktop: "desktop";
  tv: "tv";
  bot: "bot";
}>;
