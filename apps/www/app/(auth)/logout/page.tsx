"use client";

import { Banner } from ":components/shell/Banner";
import { useTerm } from ":components/terms/context";
import { signOut } from "@1.modules/auth.next/react";
import { useAsync, useMountEffect } from "@react-hookz/web";

//

export default function Page() {
  const { decline } = useTerm();
  const [, { execute }] = useAsync(async () => {
    decline();
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
