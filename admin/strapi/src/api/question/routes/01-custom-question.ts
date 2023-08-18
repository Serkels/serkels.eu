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
      info: { apiName: "plugin::question.answers", type: "content-api" },
    },
    {
      method: "GET",
      path: "/question/:id/awnsers",
      handler: "api::question.answers.find",
      config: {
        description: "Get question awnsers",
        middlewares: [
          "api::question.relation",
          "api::question.replate-author-by-profile",
        ],
        policies: [],
      },
      info: { apiName: "api::question.answers", type: "content-api" },
    },
    {
      method: "POST",
      path: "/question/:id/awnsers",
      handler: "api::question.answers.post",
      config: {
        description: "Get question awnsers",
        middlewares: [
          "api::question.relation",
          "api::question.replate-author-by-profile",
        ],
        policies: [],
      },
      info: { apiName: "api::question.answers", type: "content-api" },
    },
  ],
};
