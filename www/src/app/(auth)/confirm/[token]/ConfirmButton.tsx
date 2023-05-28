"use client";

//

import { signIn } from "next-auth/react";
import { useCallback } from "react";
//

// export const metadata: Metadata = {
//   title: "Sign In _ Toc-Toc",
//   description: "Sign In",
// };

export function ConfirmButton({ token }: { token: string }) {
  const verify = useCallback(async () => {
    const sdf = await signIn("credentials", {
      token,
      callbackUrl: "/exchange",
    });
    console.log({ sdf });
  }, [token]);
  return <button onClick={verify}>Confirm</button>;
}

//
