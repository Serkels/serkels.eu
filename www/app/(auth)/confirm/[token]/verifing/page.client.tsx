"use client";

import { HTTPError } from "@1/core_";
import { useQuery } from "@tanstack/react-query";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { P, match } from "ts-pattern";

//

export default function Verifying_Flow({ token }: { token: string }) {
  const router = useRouter();
  const query_info = useSignIn_Query(token);

  useEffect(() => {
    return match(query_info)
      .with({ status: "error", error: P.select() }, (error) => {
        throw error;
      })
      .with({ status: "success" }, () => {
        router.replace(`/confirm/${token}/authorized`);
      })
      .otherwise(() => {});
  }, [query_info.status]);

  return null;
}

//

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
