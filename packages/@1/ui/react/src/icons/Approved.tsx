//

import type { ComponentPropsWithoutRef } from "react";

//

export function Approved(props: ComponentPropsWithoutRef<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      {...props}
    >
      <circle cx="7" cy="7" r="7" fill="#39b154" />
      <path
        d="M-8534.394-864.259l2.49,2.49,5.434-5.434"
        transform="translate(8537.744 871.538)"
        fill="none"
        stroke="#fff"
        strokeWidth="2"
      />
    </svg>
  );
}
