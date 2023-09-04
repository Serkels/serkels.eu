//

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { parse } from "yaml";

//

export default function mutateDocumentation(generatedDocumentationDraft: {
  components: { schemas: object };
  paths: object;
}) {
  ["./me.yaml"].reduce((document, yaml_file) => {
    const openapi_path = parse(
      readFileSync(resolve(__dirname.replace("/dist", ""), yaml_file), "utf8"),
    );

    Object.assign(document.paths, openapi_path);
    return document;
  }, generatedDocumentationDraft);

  //

  const UserProfileRequest =
    generatedDocumentationDraft.components.schemas["UserProfileRequest"];
  generatedDocumentationDraft.components.schemas["UserProfileRequest"] = {
    ...UserProfileRequest,
    properties: {
      data: {
        ...UserProfileRequest.properties.data,
        required: [],
        properties: {
          ...UserProfileRequest.properties,
          image: {
            ...UserProfileRequest.properties.image,
            oneOf: [
              {
                $ref: "#/components/schemas/SetRelation",
              },
            ],
          },
        },
      },
    },
  };
}
