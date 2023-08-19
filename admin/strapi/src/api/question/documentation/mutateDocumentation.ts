//

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { parse } from "yaml";

import question_id_answers from "./question_id_answers.json";
import question_id_answers_count from "./question_id_answers_count.json";

//

export default function mutateDocumentation(generatedDocumentationDraft) {
  Object.assign(generatedDocumentationDraft.paths, question_id_answers_count);
  Object.assign(generatedDocumentationDraft.paths, question_id_answers);

  const question_id_awnsers_id = parse(
    readFileSync(
      resolve(__dirname.replace("/dist", ""), "./question_id_awnsers_id.yaml"),
      "utf8",
    ),
  );

  Object.assign(generatedDocumentationDraft.paths, question_id_awnsers_id);
}
