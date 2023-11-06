//

import type { ComponentPropsWithoutRef } from "react";

//

export function Denied(props: ComponentPropsWithoutRef<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      {...props}
    >
      <circle cx="8" cy="8" r="8" fill="#ff5f5f" />
      <rect
        width="10"
        height="2"
        rx="1"
        transform="translate(3 7)"
        fill="#fff"
      />
    </svg>
  );
}
