//

import { Entity, Result, type ErrorInstance } from "@1/core/domain";
import { z } from "zod";

//

export class Opportunity extends Entity<Opportunity_Props> {
  static override create(
    props: Opportunity_Props,
  ): Result<Opportunity, ErrorInstance> {
    return Result.Ok(new Opportunity(props));
  }

  static zero = Opportunity.create({
    id: NaN,
    createdAt: new Date(0),
    updatedAt: new Date(0),
    //
    title: "",
    slug: "",
    expireAt: new Date(0),
    cover: "",
    location: "",
    category: "",
    partner: "",
  }).value();
}

//

export const Opportunity_PropsSchema = z
  .object({
    id: z.number(),
    createdAt: z.date(),
    updatedAt: z.date(),
    //
    title: z.string(),
    slug: z.string(),
    cover: z.any(),
    expireAt: z.date(),
    location: z.string(),
    partner: z.any(),
    category: z.any(),
  })
  .describe("Category Props");

export type Opportunity_Props = z.TypeOf<typeof Opportunity_PropsSchema>;
