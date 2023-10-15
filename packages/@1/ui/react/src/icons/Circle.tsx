//

import type { SVGProps } from "react";

//

export function Circle(props: SVGProps<any>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" {...props}>
      <circle cx="8" cy="8" r="8" fill="currentColor" />
    </svg>
  );
}
