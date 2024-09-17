//

import { GoogleAnalytics } from "@next/third-parties/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Script from "next/script";
import { Suspense } from "react";
import { Analytics_Client } from "./Analytics.client";

//

export const GA_TRACKING_ID = process.env["NEXT_PUBLIC_GA_MEASUREMENT_ID"]!;

export default async function Analytics() {
  // const session = await getServerSession();
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

      <GoogleAnalytics gaId={GA_TRACKING_ID} />
      <Suspense>
        <Analytics_Client />
      </Suspense>
    </>
  );
}
