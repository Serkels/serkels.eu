//

import { Entity, Result } from "@1/core/domain";
import { ZodError, z } from "zod";
import { Category } from "../../category/domain";
import { Entity_Schema } from "../../common/record";
import { Profile } from "../../profile/domain";
import { Type, type TypeProps } from "./Type.value";

//

export const Exchange_PropsSchema = Entity_Schema.augment({
  available_places: z.coerce.number().default(Number.MIN_SAFE_INTEGER),
  category: z.instanceof(Category).default(Category.unknown), //Category_DataRecord,
  description: z.string().default(""),
  in_exchange_of: z.instanceof(Category).optional(),
  is_online: z.boolean().default(true),
  location: z.string().default(""),
  places: z.coerce.number().default(Number.MIN_SAFE_INTEGER),
  profile: z.instanceof(Profile).default(Profile.zero),
  slug: z.string().default(""),
  title: z.string().default(""),
  type: z
    .union([z.literal("proposal"), z.literal("research")])
    .default("research"),
  when: z.coerce.date().default(new Date(NaN)),
}).describe("Exchange_PropsSchema");

type Props = z.TypeOf<typeof Exchange_PropsSchema>;
type Props_Input = z.input<typeof Exchange_PropsSchema>;

//

export class Exchange extends Entity<Props> {
  static override create(props: Props_Input): Result<Exchange, ZodError> {
    const result = Exchange_PropsSchema.safeParse(props, {
      path: ["<Exchange.create>", "props"],
    });
    if (result.success) {
      return Result.Ok(new Exchange(result.data));
    } else {
      return Result.fail(result.error);
    }
  }

  static zero = Exchange.create({
    id: Number.MAX_SAFE_INTEGER,
  } satisfies Props_Input).value();

  //

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
  get profile() {
    return this.props.profile;
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
