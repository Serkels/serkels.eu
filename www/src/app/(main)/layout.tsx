///

import { USER_PROFILE_ID_TOKEN } from "@1/core/domain";
import { Grid } from "@1/ui/components/Grid";
import type { PropsWithChildren } from "react";
import { AppFooter } from "~/components/AppFooter.server";
import { UserBar } from "~/components/UserBar";
import { Hydrate_Container_Provider } from "~/core/react.client";
import { JWT_TOKEN } from "../api/v1/OpenAPI.repository";
import { register } from "./register";

export default async function Layout({ children }: PropsWithChildren) {
  const container = await register();

  const jwt = container.resolve(JWT_TOKEN);
  const profile_id = container.resolve(USER_PROFILE_ID_TOKEN);

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
