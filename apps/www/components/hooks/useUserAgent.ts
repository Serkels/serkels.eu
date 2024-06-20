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
