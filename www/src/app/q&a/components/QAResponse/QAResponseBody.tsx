//

import { useContext } from "react";
import { QAResponseContext } from "./QAResponse.context";

export function QAResponseBody() {
  const {
    response: { content },
  } = useContext(QAResponseContext);
  return <article className="ml-12">{content}</article>;
}
