//

import type { Metadata, ResolvingMetadata } from "next";
import Image from "next/image";

//

export async function generateMetadata(
  _: unknown,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  return {
    title: `My Exchange List :: ${(await parent).title?.absolute}`,
  };
}

//

export default async function Page() {
  return (
    <main className="col-span-full overflow-hidden px-4 md:col-span-4 xl:col-span-6">
      <Empty />
    </main>
  );
}

function Empty() {
  return (
    <figure className="flex h-full items-center justify-center">
      <Image
        src="/toc-toc.svg"
        alt="Toc Toc Logo"
        width={175}
        height={53}
        priority
      />
      <figcaption></figcaption>
    </figure>
  );
}
