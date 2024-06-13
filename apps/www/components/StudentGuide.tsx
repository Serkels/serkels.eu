//

import type { ComponentPropsWithoutRef } from "react";

//

export function StudentGuide(props: ComponentPropsWithoutRef<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="187"
      height="289"
      viewBox="0 0 187 289"
      className="bg-secondary-blue-gradient"
      {...props}
    >
      <defs>
        <linearGradient
          x1="0.277"
          y1="0.836"
          x2="1.27"
          gradientUnits="objectBoundingBox"
        >
          <stop offset="0" stopColor="#00adee" />
          <stop offset="1" stopColor="#023f87" />
        </linearGradient>
      </defs>
      <g transform="translate(-1113 -188)">
        <g
          transform="translate(1113 188)"
          stroke="#fff"
          strokeWidth="4"
          fill="url(#linear-gradient)"
        >
          <rect width="187" height="289" stroke="none" />
          <rect x="2" y="2" width="183" height="285" fill="none" />
        </g>
        <path
          className="fill-white"
          d="M51.718,66.174C35.02,64.606,24.1,51.823,23.992,51.694V29.567l31.823,7.6L81.7,23.811V54.585C81.209,55.069,69.709,66.3,54.567,66.3,53.618,66.3,52.659,66.258,51.718,66.174Zm35.7-26.011V15.048L55.815,31.355,9.351,20.262,0,18.029,46.466,0,99.873,8.627l-8.365,4.311V40.163Z"
          fill="#fff"
          transform="translate(1157 280.4)"
        />
        <text
          className="font-sans"
          transform="translate(1207 230)"
          fill="#fff"
          fontSize="20"
          fontFamily="HelveticaNeue-Bold, Helvetica Neue"
          fontWeight="700"
        >
          <tspan x="-47" y="0">
            LE GUIDE
          </tspan>
          <tspan x="-60" y="28">
            D’ÉTUDIANT
          </tspan>
        </text>
        <text
          className="font-sans"
          transform="translate(1130 390)"
          fill="#fff"
          fontSize="10"
          fontFamily="HelveticaNeue, Helvetica Neue"
        >
          <tspan x="3" y="10">
            Trouverez toutes les informations{" "}
          </tspan>
          <tspan x="16" y="25">
            utiles pour bénéficier d’une{" "}
          </tspan>
          <tspan x="10" y="40">
            bourse, faire une demande de{" "}
          </tspan>
          <tspan x="7" y="55">
            logement, bénéficier d’aides …
          </tspan>
        </text>
        <path
          className="fill-white"
          d="M1264.933,346.915S1244.9,352,1231.184,358.421s-28.706,22.357-28.706,22.357-11.06-13.949-28.119-22.357-47.477-11.505-47.477-11.505,33.011,11.258,43.576,19.355,20.286,15.366,21.167,18.359a14.374,14.374,0,0,1,0,6.515h19.546s-3.874-3.446,0-6.515,16.389-13.281,24.489-18.359S1264.933,346.915,1264.933,346.915Z"
          fill="#fff"
          transform="translate(9.533 -6.545)"
        />
      </g>
    </svg>
  );
}
