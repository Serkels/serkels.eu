//

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { parse } from "yaml";

//

export default function mutate_inbox_documentation(generated_documentation_draft: {
  paths: object;
}) {
  ["./messages.yaml", "./messages_id.yaml"].reduce((document, yaml_file) => {
    const openapi_path = parse(
      readFileSync(resolve(__dirname.replace("/dist", ""), yaml_file), "utf8"),
    );

    Object.assign(document.paths, openapi_path);
    return document;
  }, generated_documentation_draft);
}
