//

import prisma from "#prisma";
import {
  create_concert_20240915,
  create_masterclass_category,
  create_vulfpeck_partner,
} from "../../../seeding";

//

export async function partners() {
  await create_masterclass_category(prisma);
  const vulfpeck_partner_id = await create_vulfpeck_partner(prisma);
  await create_concert_20240915(prisma, vulfpeck_partner_id);

  return { vulfpeck_partner_id };
}
