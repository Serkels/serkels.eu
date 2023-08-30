//

import Image from "next/image";
import { _set_fixed_page_layout } from "../layout.client";

//

export default async function Page() {
  return (
    <main className="col-span-full px-4 md:col-span-4 xl:col-span-6">
      <_set_fixed_page_layout />
      <Empty />
    </main>
  );
}

function Empty() {
  return (
    <figure className="flex h-full items-center justify-center">
      <Image
        className=""
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
