"use client";

import { usePathname } from "next/navigation";
import { useCallback } from "react";

//

export function useIsActive({ root } = { root: "" }) {
  const pathname = usePathname();
  return useCallback(
    function is_active_test(href: string) {
      const target_href = String(href).replace("./", root);
      const rest_pathname = pathname.replace(target_href, "");
      return rest_pathname !== pathname;
    },
    [pathname, root],
  );
}
