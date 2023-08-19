//

export default function mutateDocumentation(generatedDocumentationDraft) {
  generatedDocumentationDraft.components.schemas["CommentRequest"] = {
    type: "object",
    properties: {
      data: {
        $ref: "#/components/schemas/CommentsComment",
      },
    },
  };

  generatedDocumentationDraft.components.schemas["CommentsComment"] = {
    type: "object",
    required: [
      "author",
      "content",
      "createdAt",
      "id",
      "gotThread",
      "related",
      "updatedAt",
    ],
    properties: {
      approvalStatus: {
        type: "string",
      },
      author: {
        allOf: [
          { $ref: "#/components/schemas/UserProfile" },
          {
            type: "object",
            properties: {
              id: {
                type: "number",
              },
            },
          },
        ],
      },
      blockReason: {
        type: "string",
      },
      blocked: {
        type: "boolean",
        default: false,
      },
      blockedThread: {
        type: "boolean",
        default: false,
      },
      content: {
        type: "string",
      },
      createdAt: {
        type: "string",
        format: "date-time",
      },
      gotThread: {
        type: "boolean",
      },
      id: {
        type: "number",
      },
      isAdminComment: {
        type: "boolean",
      },
      related: {
        allOf: [
          { $ref: "#/components/schemas/Question" },
          {
            type: "object",
            required: ["id"],
            properties: {
              id: {
                type: "number",
              },
            },
          },
        ],
        required: true,
      },
      removed: {
        type: "boolean",
      },
      threadOf: {
        type: "object",
        required: ["data"],
        properties: {
          data: {
            required: ["id", "attributes"],
            type: "object",
            properties: {
              id: {
                type: "number",
              },
              attributes: {
                type: "object",
                properties: {},
              },
            },
          },
        },
      },
      updatedAt: {
        type: "string",
        format: "date-time",
      },
    },
  };
  //   data?: components["schemas"]["CommentsCommentResponseDataObject"];
  //   meta?: Record<string, unknown>;
  // };
}
