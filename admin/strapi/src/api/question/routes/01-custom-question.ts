export default {
  routes: [
    {
      method: "GET",
      path: "/question/:id/awnsers/count",
      handler: "api::question.answers.count",
      config: {
        description: "Get question awnsers count",
        middlewares: [],
        policies: [],
      },
      info: { apiName: "plugin::question.question", type: "content-api" },
    },
    {
      method: "GET",
      path: "/question/:id/awnsers",
      handler: "api::question.answers.find",
      // handler: "plugin::comments.client.findAllFlat",
      config: {
        description: "Get question awnsers",
        middlewares: [
          "api::question.relation",
          "api::question.replate-author-by-profile",
        ],
        policies: [
          () => {
            console.log("??");
            return true;
          },
        ],
      },
      info: { apiName: "plugin::comments.comment", type: "content-api" },
    },
    {
      method: "POST",
      path: "/question/:id/awnsers",
      handler: "plugin::comments.client.post",
      config: {
        description: "Get question awnsers",
        middlewares: [
          "api::question.relation",
          "api::question.replate-author-by-profile",
        ],
        policies: [],
      },
      info: { apiName: "plugin::comments.comment", type: "content-api" },
    },
  ],
};
