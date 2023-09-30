//

import { z } from "zod";
import { StrapiEntity, z_strapi_flatten_page_data } from "../../../common";
import { Inbox } from "../../domain";

//

export const Inbox_Record = StrapiEntity(z.any())
  .transform(({ data }, ctx) => {
    if (!data) {
      return;
    }

    const entity = Inbox.create({ id: data.id, ...data.attributes });
    if (entity.isFail()) {
      entity.error().issues.map(ctx.addIssue);
    }
    return entity.value();
  })
  .describe("Maybe Inbox Record");

//

export const InboxList_Schema = z_strapi_flatten_page_data(Inbox_Record);

export type InboxList_Schema = z.TypeOf<typeof InboxList_Schema>;
