//

export default {
  routes: [
    {
      // Path defined with a URL parameter
      method: "GET",
      path: "/user-profiles/me",
      handler: "user-profile.me",

      config: {
        policies: [],
        middlewares: [],
        description: "Get authenticated user profile",
      },
    },
    {
      // Path defined with a URL parameter
      method: "PUT",
      path: "/user-profiles/me",
      handler: "user-profile.me_update",

      config: {
        policies: [],
        middlewares: [],
        description: "Update authenticated user profile",
      },
    },
  ],
};
