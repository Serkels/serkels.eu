//

import Image from "next/image";

//

export function Serkels_Placeholder() {
  return (
    <figure className="flex h-full items-center justify-center">
      <Image
        className=""
        src="/serkels-noir.svg"
        alt="Serkels Logo"
        width={175}
        height={53}
        priority
      />
      <figcaption></figcaption>
    </figure>
  );
}
