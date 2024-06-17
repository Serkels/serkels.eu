//

import type { SVGProps } from "react";
import { match } from "ts-pattern";

export function Exchange({
  primary_gradient,
  ...props
}: SVGProps<SVGSVGElement> & { primary_gradient?: boolean }) {
  const path_props: SVGProps<SVGPathElement> = primary_gradient
    ? {
        fill: "url(#primary_gradient)",
      }
    : { className: "fill-current", fill: "currentColor" };
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="74.35 9.9 24.82 14.92"
      {...props}
    >
      <defs>
        {match({ primary_gradient })
          .with({ primary_gradient: true }, () => <PrimaryGradientDefs />)
          .otherwise(() => null)}
      </defs>
      <path
        d="m3712.764 940.673-9.916 9.916v-4.958h-14.874l9.916-9.916v4.958l10.93.008Z"
        transform="translate(-3613.608 -925.799)"
        {...path_props}
      />
    </svg>
  );
}

function PrimaryGradientDefs() {
  return (
    <linearGradient id="primary_gradient" gradientTransform="rotate(25)">
      <stop stop-color="#000" stop-opacity="0" />
      <stop offset=".22" stop-color="#00ADEE" />
      <stop offset=".42" stop-color="#3A6DBF" />
      <stop offset=".64" stop-color="#782B8F" />
      <stop offset=".65" stop-color="#7C298E" />
      <stop offset=".81" stop-color="#A81C8C" />
      <stop offset=".93" stop-color="#C3148B" />
      <stop offset="1" stop-color="#CE118B" />
    </linearGradient>
  );
}
