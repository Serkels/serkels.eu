///

import { ID_Schema, USER_PROFILE_ID_TOKEN } from "@1/core/domain";
import { Grid } from "@1/ui/components/Grid";
import type { PropsWithChildren } from "react";
import { z } from "zod";
import { AppFooter } from "~/components/AppFooter.server";
import { UserBar } from "~/components/UserBar";
import { childInjector, injector } from "~/core/di";
import { Hydrate_Container_Provider } from "~/core/react.client";
import { get_api_session } from "../api/auth/[...nextauth]/route";
import { JWT_TOKEN } from "../api/v1/OpenAPI.repository";

export default async function Layout({ children }: PropsWithChildren) {
  console.log("< src/app/(main)/layout.tsx");

  childInjector(async (container) => {
    console.log("childInjector src/app/(main)/layout.tsx");
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
    container.registerInstance(JWT_TOKEN, jwt);
    container.registerInstance(USER_PROFILE_ID_TOKEN, profile_id);

    console.log("src/app/(main)/layout.tsx", { session, jwt, profile_id });
  });

  const container = await injector();
  const jwt = container.resolve(JWT_TOKEN);
  const profile_id = container.resolve(USER_PROFILE_ID_TOKEN);
  console.log("</ src/app/(main)/layout.tsx", jwt);

  //

  return (
    <Hydrate_Container_Provider
      registerAll={[
        {
          registerInstance: [JWT_TOKEN, jwt],
        },
        {
          registerInstance: [USER_PROFILE_ID_TOKEN, profile_id],
        },
      ]}
    >
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
    </Hydrate_Container_Provider>
  );
}
