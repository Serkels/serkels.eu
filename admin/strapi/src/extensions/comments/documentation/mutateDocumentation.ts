//

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { parse } from "yaml";
export default async function mutateDocumentation(generatedDocumentationDraft) {
  generatedDocumentationDraft.components.schemas["CommentRequest"] = {
    type: "object",
    required: ["data"],
    properties: {
      data: {
        required: ["content"],
        type: "object",
        properties: {
          content: { type: "string" },
        },
      },
    },
  };

  const comment_list_response = parse(
    readFileSync(
      resolve(__dirname.replace("/dist", ""), "./comment_list_response.yaml"),
      "utf8",
    ),
  );
  Object.assign(
    generatedDocumentationDraft.components.schemas,
    comment_list_response,
  );

  const comments_comment = parse(
    readFileSync(
      resolve(__dirname.replace("/dist", ""), "./comments_comment.yaml"),
      "utf8",
    ),
  );
  Object.assign(
    generatedDocumentationDraft.components.schemas,
    comments_comment,
  );
}
