//

export default {
  routes: [
    {
      method: "GET",
      path: "/categories;question",
      handler: "api::category-question.category-question.find",
      config: {
        description: "Get question categories",
        middlewares: ["api::category.populate"],
      },
    },
  ],
};
