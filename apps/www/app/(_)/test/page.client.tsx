"use client";

import { TRPC_React } from ":trpc/client";
import { HTTPError } from "@1.modules/core/errors";
import { useQuery } from "@tanstack/react-query";
import { signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import { P, match } from "ts-pattern";

//

function useRandomNumberSubscription() {
  const [num, setNumber] = useState<number>(NaN);
  TRPC_React.randomNumber.useSubscription(undefined, {
    onData(n) {
      setNumber(n.randomNumber);
    },
  });
  return num;
}

function useSignIn_Query(token: string) {
  return useQuery({
    queryFn: async () => {
      const response = await signIn("credentials", {
        token,
        redirect: false,
      });

      if (!response) throw new HTTPError("Missing response");
      if (response.error) throw new HTTPError(response.error);

      return response.url;
    },
    queryKey: ["next_auth", "sign_in", token] as const,
  });
}

export function Client_Page_() {
  const token = "sdf";
  const healthcheck = TRPC_React.hello.useQuery({ name: "Dino" });
  const query_info = useSignIn_Query(token);

  //

  useEffect(() => {
    return match(query_info)
      .with({ status: "error", error: P.select() }, (error) => {
        throw error;
      })
      .with({ status: "success" }, () => {
        // router.replace(`/confirm/${token}/authorized`);
        console.log("👏👏");
      })
      .otherwise(() => {});
  }, [query_info.status]);

  //

  const num = useRandomNumberSubscription();

  return (
    <main>
      <h1>Client_Page</h1>
      <br />
      <code>{healthcheck.data}</code>
      <br />
      Here&apos;s a random number from a sub: {num} <br />
      <br />
    </main>
  );
}

export function Client_Page() {
  const magic = TRPC_React.auth.passwordless.magic.useMutation();

  //

  const num = useRandomNumberSubscription();

  return (
    <main>
      <h1>Client_Page</h1>
      <br />
      <button
        onClick={() =>
          magic.mutate({ email: "alejandrin.howe81@ethereal.email" })
        }
      >
        Connect as alejandrin.howe81@ethereal.email
      </button>
      <br />
      Here&apos;s a random number from a sub: {num} <br />
      <br />
    </main>
  );
}
