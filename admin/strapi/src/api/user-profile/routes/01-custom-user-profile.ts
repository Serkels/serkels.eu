module.exports = {
  routes: [
    {
      method: "GET",
      path: "/avatars/u/:id",
      handler: "api::user-profile.user-profile.avatar",
    },
  ],
};
