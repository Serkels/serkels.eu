//

export default function mutateDocumentation(generatedDocumentationDraft) {
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
