//

import { AppContext } from "@1/strapi-trpc-router";
import { getService } from "@strapi/plugin-users-permissions/server/utils";
import { observable } from "@trpc/server/observable";

//
export default {
  subscription_to: {
    notifications(user_id: number) {
      const controller = {} as any; //new Question_Notification_Observer(user_id);
      return controller.observable;
    },
    messages(id: number) {
      return observable(() => {});
    },
  },

  async verify_jwt(jwt: string) {
    return getService("jwt").verify(jwt) as { id: number };
  },
} satisfies AppContext;
