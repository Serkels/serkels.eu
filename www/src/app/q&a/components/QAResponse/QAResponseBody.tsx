//

import { useContext } from "react";
import { QAResponseContext } from "./QAResponse.context";

export function QAResponseBody() {
  const {
    response: { content },
  } = useContext(QAResponseContext);
  console.log({ content });
  return <article className="ml-12">{content}</article>;
}
