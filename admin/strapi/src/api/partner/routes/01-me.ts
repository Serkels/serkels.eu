//

module.exports = {
  routes: [
    {
      method: "GET",
      path: "/partners/me",
      handler: "api::partner.me.find",
      config: {
        policies: ["global::is-authenticated"],
        middlewares: [],
        description: "Get authenticated user profile",
      },
      info: { apiName: "partner", type: "content-api" },
    },
    {
      method: "PUT",
      path: "/partners/me",
      handler: "api::partner.me.update",
      config: {
        policies: ["global::is-authenticated"],
        middlewares: [],
        description: "Update authenticated user profile",
      },
      info: { apiName: "partner", type: "content-api" },
    },
  ],
};

//
