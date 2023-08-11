//

import question_id_awnsers from "./question_id_awnsers.json";
import question_id_awnsers_count from "./question_id_awnsers_count.json";

//

export default function mutateDocumentation(generatedDocumentationDraft) {
  Object.assign(generatedDocumentationDraft.paths, question_id_awnsers_count);
  Object.assign(generatedDocumentationDraft.paths, question_id_awnsers);
}
