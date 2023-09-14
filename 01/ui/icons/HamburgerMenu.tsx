//

import type { SVGProps } from "react";

export function HamburgerMenu(props: SVGProps<any>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="18"
      viewBox="0 0 19.626 17.841"
      {...props}
    >
      <g fill="currentColor">
        <rect width="19.626" height="3.013" transform="translate(0 0)" />
        <rect width="19.626" height="3.013" transform="translate(0 7.414)" />
        <rect width="19.626" height="3.013" transform="translate(0 14.828)" />
      </g>
    </svg>
  );
}
