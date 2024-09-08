"use client";

import { Banner } from ":components/shell/Banner";
import { Loading } from "@1.ui/react/async";
import { useAsync, useMountEffect } from "@react-hookz/web";
import { signOut } from "next-auth/react";
import { Suspense } from "react";

//

export default function Page() {
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
        <div className="mx-auto mt-12 text-center">
          <Suspense fallback={<Loading />}>
            <DoLogout />
          </Suspense>
        </div>
      </main>
    </Banner>
  );
}

function DoLogout() {
  const [, { execute }] = useAsync(async () => {
    await new Promise((resolve) => setTimeout(resolve, 3_333));
    return signOut({ redirect: true, callbackUrl: "/" });
  });

  useMountEffect(execute);
  return <Loading />;
}
