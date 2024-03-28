//

import type { SVGProps } from "react";

//

export function Warning(props: SVGProps<any>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 17.169" {...props}>
      <g transform="translate(0)">
        <g transform="translate(9.001 5.722)">
          <path
            className="fill-current"
            d="M11.42,9.5v3a1,1,0,0,0,2,0v-3a1,1,0,0,0-2,0"
            transform="translate(-11.42 -8.5)"
            fill="currentColor"
          />
          <path
            className="fill-current"
            d="M11.42,15.5v.011a1,1,0,0,0,2,0V15.5a1,1,0,0,0-2,0"
            transform="translate(-11.42 -8.5)"
            fill="currentColor"
          />
        </g>
        <path
          className="fill-current"
          d="M23.529,18.422h0l-8-13.183h0a1.993,1.993,0,0,0-3.408,0h0L4.112,18.422h0a1.978,1.978,0,0,0-.291,1.032,2.009,2.009,0,0,0,.557,1.384,1.981,1.981,0,0,0,1.439.612h16.01a1.972,1.972,0,0,0,1.437-.612,2.007,2.007,0,0,0,.557-1.384A1.975,1.975,0,0,0,23.529,18.422Zm-1.358,1.372a.46.46,0,0,1-.344.144H5.817a.465.465,0,0,1-.345-.144.5.5,0,0,1-.138-.34l.072-.248h0l8-13.183a.481.481,0,0,1,.822,0h0l8,13.183h0l.072.248A.5.5,0,0,1,22.171,19.794Z"
          transform="translate(-3.821 -4.281)"
          fill="currentColor"
        />
      </g>
    </svg>
  );
}
