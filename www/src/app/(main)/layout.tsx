///

import { $1 } from "@1/core/$1";
import { ID_Schema, USER_PROFILE_ID_TOKEN } from "@1/core/domain";
import { Grid } from "@1/ui/components/Grid";
import type { PropsWithChildren } from "react";
import { z } from "zod";
import { AppFooter } from "~/components/AppFooter.server";
import { UserBar } from "~/components/UserBar";
import { get_api_session } from "../api/auth/[...nextauth]/route";
import { JWT_TOKEN } from "../api/v1/OpenAPI.repository";
import { Root_Module } from "../layout";

//

@$1.module({
  parent: Root_Module,
  async registrationFn() {
    const session = await get_api_session();

    const profile_id =
      ID_Schema.optional().parse(session?.user?.profile.id, {
        path: ["session?.user?.profile.id"],
      }) ?? NaN;

    const jwt = z
      .string()
      .default("")
      .parse(session?.user?.jwt, {
        path: ["session.user?.jwt"],
      });

    return [
      {
        token: JWT_TOKEN,
        useValue: jwt,
      },
      {
        token: USER_PROFILE_ID_TOKEN,
        useValue: profile_id,
      },
    ];
  },
})
export class Main_Module {
  static async Provider({ children }: PropsWithChildren) {
    return (
      <div className="grid min-h-screen grid-rows-[max-content_1fr_max-content]">
        <UserBar />
        <Grid
          $padding={false}
          className="min-h-[calc(100vh_-_theme(spacing.16)-_theme(spacing.8))]"
        >
          {children}
        </Grid>
        <AppFooter />
      </div>
    );
  }
}

//

export default Main_Module.Provider;
