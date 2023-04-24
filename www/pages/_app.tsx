//

//
import "@unocss/reset/sanitize/sanitize.css";
//
import "@unocss/reset/sanitize/assets.css";
//
import type { AppProps } from "next/app";
import "uno.css";

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
