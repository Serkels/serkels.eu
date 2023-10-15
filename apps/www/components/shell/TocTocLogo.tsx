//

import Image from "next/image";

//

export default function TocTocLogo() {
  return (
    <Image
      src="/toc-toc.svg"
      alt="Toc Toc Logo"
      width={175}
      height={53}
      priority
    />
  );
}
