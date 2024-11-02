//

import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { Footer } from "./Footer";
export async function AppFooter() {
  const now = await getServerDate();
  const year = new Date(now).getFullYear();
  return <Footer year={year} now={now} />;
}

async function getServerDate() {
  const dateString = new Date().toISOString();

  const day = format(parseISO(dateString), "dd", { locale: fr });
  const month = format(parseISO(dateString), "MMMM", { locale: fr });
  const year = format(parseISO(dateString), "yyyy", { locale: fr });

  const capitalizedMonth = month.charAt(0).toUpperCase() + month.slice(1);

  return `${day} ${capitalizedMonth} ${year}`;
}
