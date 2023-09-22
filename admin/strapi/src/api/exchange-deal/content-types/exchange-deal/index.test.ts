//

/// <reference types="bun-types" />

import { GetValueByKey } from "@strapi/strapi/lib/types/core/attributes";
import { expect, test } from "bun:test";
import { z } from "zod";
import { EXCHANGE_DEAL_API_CONTENT_ID, deal_state_schema } from "./index";

test("deal_state_schema", () => {
  const expected = "approved" as z.TypeOf<typeof deal_state_schema>;
  const actual = "approved" as GetValueByKey<
    typeof EXCHANGE_DEAL_API_CONTENT_ID,
    "status"
  >;

  // expectTypeOf<typeof actual>().toEqualTypeOf<typeof expected>();

  expect(actual).toEqual(expected);
});
