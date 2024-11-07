//

import type { Metadata, ResolvingMetadata } from "next";
import Link from "next/link";

//

export async function generateMetadata(
  _: never,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const title = `Sign In :: ${(await parent).title?.absolute}`;

  return {
    title,
    openGraph: {
      title,
    },
  };
}

//

export default async function Page(props: {
  params: Promise<{ token: string }>;
}) {
  const params = await props.params;
  const { token } = params;

  return (
    <div>
      <p className="mx-auto max-w-xl text-center text-xl">
        Pour terminer le processus de vérification, veuillez cliquer sur le
        bouton ci-dessous :
      </p>
      <Link
        href={`/confirm/${token}/verifing`}
        className="mx-auto my-6 block w-fit rounded-sm bg-white p-3 font-bold text-black"
      >
        Confirm
      </Link>
    </div>
  );
}

//
