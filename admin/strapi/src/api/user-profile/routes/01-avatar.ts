module.exports = {
  routes: [
    {
      method: "GET",
      path: "/avatars/u/:id",
      handler: "api::user-profile.avatar.find_by_profile_id",
    },
  ],
};
