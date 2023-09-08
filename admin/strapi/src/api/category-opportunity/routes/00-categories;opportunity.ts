//

export default {
  routes: [
    {
      method: "GET",
      path: "/categories;opportunity",
      handler: "api::category-opportunity.category-opportunity.find",
      config: {
        description: "Get opportunity categories",
        middlewares: ["api::category.populate"],
      },
    },
  ],
};
