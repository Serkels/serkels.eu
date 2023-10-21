//

import { match } from "ts-pattern";
import { useQuestion } from "./context";

//

export function ResponseCount() {
  const question = useQuestion();
  return match(question).otherwise(() => <p>...</p>);
}
