//

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { parse } from "yaml";

//

export default function mutateDocumentation(generatedDocumentationDraft: {
  paths: object;
}) {
  ["./messages.yaml", "./messages_id.yaml", "./by_exchange.yaml"].reduce(
    (document, yaml_file) => {
      const openapi_path = parse(
        readFileSync(
          resolve(__dirname.replace("/dist", ""), yaml_file),
          "utf8",
        ),
      );

      Object.assign(document.paths, openapi_path);
      return document;
    },
    generatedDocumentationDraft,
  );
}
