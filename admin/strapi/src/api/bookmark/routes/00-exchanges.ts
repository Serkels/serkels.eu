//

export default {
  routes: [
    {
      method: "GET",
      path: "/bookmark/exchanges",
      handler: "api::bookmark.exchange.find",
      config: {
        description: "Get your exchange bookmarks",
        middlewares: ["api::exchange.populate"],
      },
      info: { apiName: "api::exchange.exchange", type: "content-api" },
    },
    {
      method: "GET",
      path: "/bookmark/exchanges/:id",
      handler: "api::bookmark.exchange.check",
      config: {
        description: "Check if a exchange in your bookmarks",
      },
    },
    {
      method: "POST",
      path: "/bookmark/exchanges/:id",
      handler: "api::bookmark.exchange.add",
      config: {
        description: "Add an exchange to your bookmarks",
      },
    },
    {
      method: "DELETE",
      path: "/bookmark/exchanges/:id",
      handler: "api::bookmark.exchange.remove",
      config: {
        description: "Remove an exchange from your bookmarks",
      },
    },
  ],
};
