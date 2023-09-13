//
import { z } from "zod";
import { z_strapi_entity, z_strapi_entity_data, z_strapi_flatten_page_data, } from "../../../common";
import { Thread_Schema } from "./Thread_Schema";
//
export const Inbox_Schema = z.object({
    id: z.number().optional(),
    thread: z_strapi_entity_data(Thread_Schema),
    updatedAt: z.coerce.date(),
});
//
export const Inbox_DataSchema = z_strapi_entity(Inbox_Schema);
//
export const InboxList_Schema = z_strapi_flatten_page_data(Inbox_Schema);
