//

import { ProfileAvatarMedia } from ":components/avatar";
import { auth } from "@1.modules/auth.next";
import type { Metadata, ResolvingMetadata } from "next";

//

export async function generateMetadata(
  _: never,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const title = `Welcome :: ${(await parent).title?.absolute}`;

  return {
    title,
    openGraph: {
      title,
    },
  };
}

//

export default async function Page() {
  const session = await auth();
  if (!session) return null;
  return (
    <main className="flex h-full flex-col items-center justify-center">
      <h1
        className={`
          my-0
          text-center text-6xl
          font-extrabold
          sm:text-7xl
          lg:text-8xl
        `}
      >
        Welcome
      </h1>
      <div className="mx-auto mt-5 text-center">
        <ProfileAvatarMedia
          profile={session.profile}
          variant={{
            tv$direction: "column",
            tv$size: "2xlarge",
          }}
        />
      </div>
    </main>
  );
}
