//

import Image from "next/image";

//

export function TocToc_Placeholder() {
  return (
    <figure className="flex h-full items-center justify-center">
      <Image
        className=""
        src="/toc-toc.svg"
        alt="Serkels Logo"
        width={175}
        height={53}
        priority
      />
      <figcaption></figcaption>
    </figure>
  );
}
