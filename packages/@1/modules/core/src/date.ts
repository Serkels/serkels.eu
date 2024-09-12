//

import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale/fr";

//

export function format_ago(date: string | number | Date) {
  return formatDistanceToNow(date, {
    locale: fr,
  });
}
