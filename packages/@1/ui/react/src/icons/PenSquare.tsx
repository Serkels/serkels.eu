//

import type { SVGProps } from "react";

//

export function PenSquare(props: SVGProps<any>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      {...props}
    >
      <g
        className="fill-none stroke-current"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      >
        <path
          className="fill-transparent"
          d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
        />
        <path
          className="fill-transparent"
          d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1l1-4Z"
        />
      </g>
    </svg>
  );
}
