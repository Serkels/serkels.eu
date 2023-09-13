//
import { z } from "zod";
export const z_strapi_flatten_page_data = (attributes) => z.array(z.object({ attributes, id: z.number() }));
export const z_strapi_entity = (attributes) => z.object({ attributes, id: z.coerce.number() });
export const z_strapi_entity_data = (attributes) => z.object({ data: z_strapi_entity(attributes).nullish() });
export const z_strapi_collection = (attributes) => z.object({
    data: z.array(z_strapi_entity(attributes)),
});
