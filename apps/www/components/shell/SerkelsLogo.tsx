//

import Image from "next/image";
import { forwardRef, type ComponentProps, type ElementRef } from "react";

//

export const SerkelsLogo = forwardRef<
  ElementRef<typeof Image>,
  Omit<ComponentProps<typeof Image>, "alt" | "src">
>(function SerkelsLogo(props, forwardedRef) {
  const { ...other_props } = props;

  return (
    <Image
      src="/serkels-noir.svg"
      alt="Serkels Logo"
      width={175}
      height={53}
      priority
      {...other_props}
      ref={forwardedRef}
    />
  );
});

export default SerkelsLogo;
