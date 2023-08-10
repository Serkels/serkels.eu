//

export default function mutateDocumentation(generatedDocumentationDraft) {
  generatedDocumentationDraft.components.schemas["CommentRequest"] = {
    type: "object",
    required: ["content"],
    properties: {
      content: {
        type: "string",
      },
    },
  };

  generatedDocumentationDraft.components.schemas["CommentsCommentResponse"] = {
    type: "object",
    required: ["content"],
    properties: {
      data: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: {
              type: "number",
            },
            content: {
              type: "string",
            },
            blocked: {
              type: "boolean",
            },
            blockedThread: {
              type: "boolean",
            },
            blockReason: {
              type: "string",
            },
            isAdminComment: {
              type: "boolean",
            },
            approvalStatus: {
              type: "string",
            },
            related: {
              type: "string",
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
            threadOf: {
              type: "object",
              properties: {
                data: {
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
          },
        },
      },
    },
  };
}
