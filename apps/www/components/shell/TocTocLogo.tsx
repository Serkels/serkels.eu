//

import Image from "next/image";
import { forwardRef, type ComponentProps, type ElementRef } from "react";

//

export const TocTocLogo = forwardRef<
  ElementRef<typeof Image>,
  Omit<ComponentProps<typeof Image>, "alt" | "src">
>(function TocTocLogo(props, forwardedRef) {
  const { ...other_props } = props;

  return (
    <Image
      src="/toc-toc.svg"
      alt="Toc Toc Logo"
      width={175}
      height={53}
      priority
      {...other_props}
      ref={forwardedRef}
    />
  );
});

export default TocTocLogo;
