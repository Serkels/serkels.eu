//

import type { SVGProps } from "react";

//

export function Envelope(props: SVGProps<any>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 17.813 12.668"
      {...props}
    >
      <g>
        <path
          d="M25.038,20.411H9.565a1.17,1.17,0,0,0-1.17,1.17v.134L17.3,27.179l8.906-5.446v-.151A1.17,1.17,0,0,0,25.038,20.411Z"
          transform="translate(-8.395 -20.411)"
          fill="currentColor"
        />
        <path
          d="M17.3,41.431a.875.875,0,0,1-.459-.13L8.4,36.12v8.135a1.17,1.17,0,0,0,1.17,1.17H25.038a1.17,1.17,0,0,0,1.17-1.17v-8.12L17.76,41.3A.878.878,0,0,1,17.3,41.431Z"
          transform="translate(-8.395 -32.757)"
          fill="currentColor"
        />
      </g>
    </svg>
  );
}
