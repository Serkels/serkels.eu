//

export default {
  routes: [
    {
      method: "GET",
      path: "/categories;exchange",
      handler: "api::category-exchange.category-exchange.find",
      config: {
        description: "Get exchange categories",
        middlewares: ["api::category.populate"],
      },
    },
  ],
};
