//

import { Footer } from "@1/ui/shell";

export async function AppFooter() {
  const now = await getServerDate();
  const year = new Date(now).getFullYear();
  return <Footer year={year} now={now} />;
}

async function getServerDate() {
  return new Date().toISOString();
}
