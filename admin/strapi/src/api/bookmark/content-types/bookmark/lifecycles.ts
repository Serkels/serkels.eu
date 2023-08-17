//

import { Event as LifecycleEvent } from "@strapi/database/lib/lifecycles";

type ParamsWhere = { params: { where: { id: number } } };

export default {
  async beforeCreate(event: LifecycleEvent) {
    // const { action, model, params } = event;
    // const data = params.data;
    // console.log(__dirname, { data });
    // event.params.data.publishedAt = null
    // event.params.data.status = null
  },
};

//
