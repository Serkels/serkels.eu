"use client";

import { Banner } from ":components/shell/Banner";
import { useAsync, useMountEffect } from "@react-hookz/web";
import { signOut } from "next-auth/react";

//

export default function Page() {
  const [, { execute }] = useAsync(async () => {
    return signOut({ redirect: true, callbackUrl: "/" });
  });

  useMountEffect(execute);

  return (
    <Banner className="col-span-full bg-black text-white">
      <main className="container mx-auto max-w-5xl">
        <h1
          className={`
            mx-auto
            my-0
            text-center text-6xl
            font-extrabold
            sm:text-7xl
            lg:text-8xl
          `}
        >
          Au revoir 👋
        </h1>
      </main>
    </Banner>
  );
}
