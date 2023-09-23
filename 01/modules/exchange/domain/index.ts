//

import { Entity, Fail, Ok, Result, type ErrorInstance } from "@1/core/domain";
import { z } from "zod";
import { Category } from "../../category/domain";
import { Strapi_ID, Strapi_Timestamps } from "../../common/record";
import { Profile } from "../../profile/domain";
import { Type, type TypeProps } from "./Type.value";

//

export const Exchange_PropsSchema = z
  .object(
    {
      available_places: z.coerce.number(),
      category: z.instanceof(Category).default(Category.unknown), //Category_DataRecord,
      description: z.string(),
      in_exchange_of: z.any(), //z.instanceof(Category).optional(),
      is_online: z.boolean(),
      location: z.string(),
      places: z.coerce.number(),
      profile: z.instanceof(Profile).default(Profile.zero),
      slug: z.string(),
      title: z.string(),
      type: z.union([z.literal("proposal"), z.literal("research")]),
      when: z.coerce.date(),
    },
    { description: "Exchange_PropsSchema_" },
  )
  .merge(Strapi_ID)
  .merge(Strapi_Timestamps)
  .describe("Exchange_PropsSchema");

type Props = z.TypeOf<typeof Exchange_PropsSchema>;
type Props_Input = z.input<typeof Exchange_PropsSchema>;

//

// export interface Exchange_Props_ {
//   id: number;
//   // done: boolean;

//   available_places: number;
//   category: Category;
//   createdAt: Date;
//   description: string;
//   in_exchange_of: Category | undefined;
//   is_online: boolean;
//   location?: string;
//   places: number;
//   profile: Profile;
//   slug: string;
//   title: string;
//   type: Type;
//   updatedAt: Date;
//   when: Date;
// }

export class Exchange extends Entity<Props> {
  static override create(props: Props_Input): Result<Exchange, ErrorInstance> {
    try {
      return Ok(
        new Exchange(
          Exchange_PropsSchema.parse(props, {
            path: ["Profile.create(props)"],
          }),
        ),
      );
    } catch (error) {
      return Fail(error as ErrorInstance);
    }
  }

  static zero = Exchange.create({} as any).value();
  get profile() {
    return this.props.profile;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }
  get title() {
    return this.props.title;
  }
  get description() {
    return this.props.description;
  }
  get type() {
    return this.props.type;
  }
  get is_online() {
    return this.props.is_online;
  }
  get location() {
    return this.props.location;
  }
  get category() {
    return this.props.category;
  }
  get in_exchange_of() {
    return this.props.in_exchange_of;
  }
  get when() {
    return this.props.when;
  }
}

//

export interface Exchange_CreateProps {
  type: TypeProps["value"];
  is_online: boolean;
  in_exchange_of?: string | undefined;
}

export const Exchange_Create_Schema = z.object(
  {
    places: z.coerce.number({ description: "places" }).min(1).max(100),
    is_online: z.coerce.boolean({ description: "is_online" }),
    title: z.string().trim().nonempty(),
    description: z.string().trim().nonempty(),
    location: z.string().trim().optional(),
    when: z.coerce.date(),
    type: Type.schema,
    category: z.coerce.number(),
    in_exchange_of: z.coerce.number().optional(),
  },
  { description: "exchange" },
);
