//

import type { SVGProps } from "react";

export function Bookmark(props: SVGProps<any>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
      <path
        className="fill-current"
        d="M5 21V5q0-.825.588-1.413T7 3h10q.825 0 1.413.588T19 5v16l-7-3l-7 3Z"
        fill="currentColor"
      />
    </svg>
  );
}
