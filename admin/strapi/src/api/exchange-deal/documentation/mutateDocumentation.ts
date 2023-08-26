//

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { parse } from "yaml";

//

export default function mutateDocumentation(generatedDocumentationDraft) {
  const by_exchange = parse(
    readFileSync(
      resolve(__dirname.replace("/dist", ""), "./by_exchange.yaml"),
      "utf8",
    ),
  );

  Object.assign(generatedDocumentationDraft.paths, by_exchange);
}
