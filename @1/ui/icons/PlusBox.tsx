//

import type { SVGProps } from "react";

//

export function PlusBox(props: SVGProps<any>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17 17" {...props}>
      <g transform="translate(1.307 0.721)">
        <g>
          <path
            d="M5,1.3A3.7,3.7,0,0,0,1.3,5v7A3.7,3.7,0,0,0,5,15.7h7A3.7,3.7,0,0,0,15.7,12V5A3.7,3.7,0,0,0,12,1.3H5M5,0h7a5,5,0,0,1,5,5v7a5,5,0,0,1-5,5H5a5,5,0,0,1-5-5V5A5,5,0,0,1,5,0Z"
            transform="translate(-1.307 -0.721)"
            fill="currentColor"
          />
          <path
            d="M10,.65H0A.65.65,0,0,1-.65,0,.65.65,0,0,1,0-.65H10a.65.65,0,0,1,.65.65A.65.65,0,0,1,10,.65Z"
            transform="translate(2.193 7.779)"
            fill="currentColor"
          />
          <path
            d="M0,10.65A.65.65,0,0,1-.65,10V0A.65.65,0,0,1,0-.65.65.65,0,0,1,.65,0V10A.65.65,0,0,1,0,10.65Z"
            transform="translate(7.193 2.779)"
            fill="currentColor"
          />
        </g>
      </g>
    </svg>
  );
}
