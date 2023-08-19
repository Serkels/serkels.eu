//

import responses_error_model from "./responses_error_model.json";

//

export default function mutateDocumentation(generatedDocumentationDraft) {
  generatedDocumentationDraft.components.responses =
    generatedDocumentationDraft.components.responses ?? {};
  Object.assign(
    generatedDocumentationDraft.components.responses,
    responses_error_model,
  );
}
