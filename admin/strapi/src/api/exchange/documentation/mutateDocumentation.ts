//

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { parse } from "yaml";

//

export default function mutateDocumentation(generatedDocumentationDraft) {
  const my_exchange = parse(
    readFileSync(resolve(__dirname.replace("/dist", ""), "./my.yaml"), "utf8"),
  );

  Object.assign(generatedDocumentationDraft.paths, my_exchange);
}
