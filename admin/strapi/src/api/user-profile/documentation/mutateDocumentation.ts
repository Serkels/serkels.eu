//

//

export default function mutateDocumentation(generatedDocumentationDraft: {
  components: { schemas: object };
  paths: object;
}) {
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
