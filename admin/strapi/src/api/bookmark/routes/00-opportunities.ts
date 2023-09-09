//

export default {
  routes: [
    {
      method: "GET",
      path: "/bookmark/opportunities",
      handler: "api::bookmark.opportunity.find",
      config: {
        description: "Get your opportunity bookmarks",
      },
    },
    {
      method: "GET",
      path: "/bookmark/opportunities/:id",
      handler: "api::bookmark.opportunity.check",
      config: {
        description: "Check if an opportunity in your bookmarks",
      },
    },
    {
      method: "POST",
      path: "/bookmark/opportunities/:id",
      handler: "api::bookmark.opportunity.add",
      config: {
        description: "Add an opportunity to your bookmarks",
      },
    },
    {
      method: "DELETE",
      path: "/bookmark/opportunities/:id",
      handler: "api::bookmark.opportunity.remove",
      config: {
        description: "Remove an opportunity from your bookmarks",
      },
    },
  ],
};
