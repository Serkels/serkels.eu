//

import type { ComponentPropsWithoutRef } from "react";

//

export function ApprovedByTheOrganizer(props: ComponentPropsWithoutRef<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      {...props}
    >
      <path
        d="M-1861-921.7h-16a8.009,8.009,0,0,1,8-8,8.009,8.009,0,0,1,8,8Z"
        transform="translate(929.704 -1861) rotate(-90)"
        className="fill-[#39b154]"
        fill="#39b154"
      />
      <path
        d="M-1861-921.7h-16a8.009,8.009,0,0,1,8-8,8.009,8.009,0,0,1,8,8Z"
        transform="translate(-913.704 1877) rotate(90)"
        className="fill-[#e3a007]"
        fill="#e3a007"
      />
      <path
        d="M8.58,15.9,6.681,14A.843.843,0,1,0,5.489,15.19l2.5,2.5a.842.842,0,0,0,1.192,0l6-6A.843.843,0,1,0,13.988,10.5Z"
        transform="translate(-2.334 -6.093)"
        className="fill-[#fff]"
        fill="#fff"
      />
    </svg>
  );
}
