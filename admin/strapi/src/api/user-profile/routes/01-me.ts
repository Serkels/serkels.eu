//

module.exports = {
  routes: [
    {
      method: "GET",
      path: "/user-profiles/me",
      handler: "api::user-profile.me.find",
      config: {
        policies: [],
        middlewares: [],
        description: "Get authenticated user profile",
      },
      info: { apiName: "user-profile", type: "content-api" },
    },
    {
      method: "PUT",
      path: "/user-profiles/me",
      handler: "api::user-profile.me.update",
      config: {
        policies: [],
        middlewares: [],
        description: "Update authenticated user profile",
      },
      info: { apiName: "user-profile", type: "content-api" },
    },
  ],
};
