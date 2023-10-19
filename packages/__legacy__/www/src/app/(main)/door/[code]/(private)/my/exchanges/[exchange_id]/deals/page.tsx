//

import Image from "next/image";

//

export default async function Page() {
  return (
    <main className="hidden overflow-hidden bg-white px-4 md:col-span-4 lg:col-span-2 xl:col-span-3 xl:block">
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
