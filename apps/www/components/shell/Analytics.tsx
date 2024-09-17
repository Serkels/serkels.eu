//

import { getServerSession } from "@1.modules/auth.next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Script from "next/script";
import { Suspense } from "react";
import { Analytics_Client } from "./Analytics.client";

//

export const GA_TRACKING_ID = process.env["NEXT_PUBLIC_GA_MEASUREMENT_ID"];

export default async function Analytics() {
  const session = await getServerSession();
  if (process.env.NODE_ENV === "development")
    return (
      <Script
        id="google-analytics-mock"
        dangerouslySetInnerHTML={{
          __html: `
window.dataLayer = [];
function gtag(){dataLayer.push(arguments);}
`,
        }}
      ></Script>
    );

  return (
    <>
      <SpeedInsights />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}

gtag('js', new Date());

gtag('config', '${GA_TRACKING_ID}', {
    page_path: window.location.pathname,
    // transport_url: window.location.origin + '/api/stalker',
    first_party_collection: true,
    user_id: '${session?.profile.id ?? ""}',
});
`,
        }}
      />

      <Script src={`/stalker.js?id=${GA_TRACKING_ID}`} />
      <Suspense>
        <Analytics_Client />
      </Suspense>
    </>
  );
}
