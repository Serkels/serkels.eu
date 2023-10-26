"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

//

export const gtag = window.gtag ?? function gtag_nopê() {};
export function Analytics_Client() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const url = `${pathname}?${searchParams}`;
    console.log(url);
    // You can now use the current URL
    // ...

    gtag("event", "page_view", {
      page_location: url,
      page_title: document.title,
    });
  }, [pathname, searchParams]);

  return null;
}
