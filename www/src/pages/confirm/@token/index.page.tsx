//

import { client } from "@/api/client";
import type { User } from "@/api/types";
import type { PageContext } from "@/pages/_default/PageContext";
import type { components } from "@1/strapi-openapi/v1";
import { AppBar } from "@1/ui/shell";
import { useEffect, type PropsWithChildren } from "react";
import { P, match } from "ts-pattern";
import { useLocalStorage } from "usehooks-ts";
import type { PageContextBuiltInClientWithClientRouting } from "vite-plugin-ssr/types";

//

export async function onBeforeRender(
  pageContext: PageContextBuiltInClientWithClientRouting
) {
  if (!pageContext.routeParams) return {};
  const loginToken = pageContext.routeParams["token"];
  if (!loginToken) return {};

  console.log("⚡ Fetching ⚡", "/passwordless/login", { loginToken });
  const { data, error } = await client.get("/passwordless/login", {
    params: { query: { loginToken } },
  });

  return {
    pageContext: {
      pageProps: data,
    },
  };
}

export function Page(
  ctx: PageContext &
    PageContextBuiltInClientWithClientRouting &
    components["schemas"]["Passwordless-User"]
) {
  // console.log(ctx);
  const { user, jwt } = ctx;
  return match({ user, jwt })
    .with(
      { jwt: P.not(P.nullish), user: P.not(P.nullish) },
      ({ user, jwt }) => <Confirmed jwt={jwt} user={user} />
    )
    .otherwise(() => <Denied />);
}

//

function Confirmed({ jwt, user }: { jwt: string; user: User }) {
  const [, setJwt] = useLocalStorage("jwt", jwt);
  const [, setUser] = useLocalStorage("user", user);
  useEffect(() => setJwt(jwt), []);
  useEffect(() => setUser(user), []);
  return (
    <Layout>
      <h1>Authentification confirmed</h1>
    </Layout>
  );
}

function Denied() {
  return (
    <Layout>
      <h1>Authentification denied</h1>
    </Layout>
  );
}

function Layout({ children }: PropsWithChildren) {
  return (
    <>
      <AppBar />
      <main
        un-flex="~ 1 items-center"
        un-justify="center"
        un-h="[calc(100vh_-_160px)]"
      >
        {children}
      </main>
    </>
  );
}
