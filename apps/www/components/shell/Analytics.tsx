//

import { Analytics as VercelAnalytics } from "@vercel/analytics/react";
import Script from "next/script";

//

export default function Analytics() {
  if (process.env.NODE_ENV === "development") return null;

  return (
    <>
      <VercelAnalytics />

      <Script
        src={`/stalker.js?id=${process.env["NEXT_PUBLIC_GA_MEASUREMENT_ID"]}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
    window.dataLayer = [];
    function gtag(){dataLayer.push(arguments);}

    gtag('js', new Date());

    gtag('config', '${process.env["NEXT_PUBLIC_GA_MEASUREMENT_ID"]}', {
        page_path: window.location.pathname,
        transport_url: window.location.origin + '/api/stalker',
        first_party_collection: true,
    });
  `,
        }}
      />
    </>
  );
}
