export default {
  routes: [
    {
      method: "GET",
      path: "/question/:id/awnsers/count",
      handler: "api::question.question.awnsers_count",
      config: {
        description: "Get question awnsers count",
        middlewares: [],
        policies: [],
      },
      info: { apiName: "plugin::question.question", type: "content-api" },
    },
  ],
};
