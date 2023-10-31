//

import type { SVGProps } from "react";

//

export function PaperPlane(props: SVGProps<any>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="17.247"
      height="16.528"
      viewBox="0 0 17.247 16.528"
      {...props}
    >
      <path
        className="fill-current"
        d="M8.75,17.612v3.333a.539.539,0,0,0,.973.319l1.95-2.653Z"
        fill="currentColor"
        transform="translate(-2.462 -4.955)"
      />
      <path
        className="fill-current"
        d="M17.021.1a.539.539,0,0,0-.562-.039L.29,8.5a.539.539,0,0,0,.075.988l4.5,1.536,9.573-8.185L7.025,11.769l7.533,2.575a.551.551,0,0,0,.174.029.539.539,0,0,0,.533-.459L17.241.619A.54.54,0,0,0,17.021.1Z"
        fill="currentColor"
        transform="translate(0 0)"
      />
    </svg>
  );
}
