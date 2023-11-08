"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

//

export function Analytics_Client() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const url = `${pathname}?${searchParams}`;

    // You can now use the current URL
    // ...

    gtag("event", "page_view", {
      page_location: url,
      page_title: document.title,
    });
  }, [pathname, searchParams]);

  return null;
}
