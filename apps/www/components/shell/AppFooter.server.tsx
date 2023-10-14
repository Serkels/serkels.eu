//

import { Footer } from "./Footer";

export async function AppFooter() {
  const now = await getServerDate();
  const year = new Date(now).getFullYear();
  return <Footer year={year} now={now} />;
}

async function getServerDate() {
  return new Date().toISOString();
}
