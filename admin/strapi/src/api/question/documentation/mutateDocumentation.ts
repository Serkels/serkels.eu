//

import question_id_awnsers_count from "./question_id_awnsers_count.json";

//

export default function mutateDocumentation(generatedDocumentationDraft) {
  //

  Object.assign(generatedDocumentationDraft.paths, question_id_awnsers_count);

  //

  generatedDocumentationDraft.paths["/question/{id}/awnsers"].get.responses[
    "200"
  ].content["application/json"].schema["$ref"] =
    "#/components/schemas/CommentsCommentResponse";

  //

  generatedDocumentationDraft.paths["/question/{id}/awnsers"].post.responses[
    "200"
  ].content["application/json"].schema["$ref"] =
    "#/components/schemas/CommentsCommentResponse";
  generatedDocumentationDraft.paths[
    "/question/{id}/awnsers"
  ].post.requestBody.content["application/json"].schema["$ref"] =
    "#/components/schemas/CommentRequest";
}
