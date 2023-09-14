//

import clsx from "clsx";
import tw from "tailwind-styled-components";

//

export const Grid = tw.div<{ $padding?: boolean }>`
  grid
  grid-cols-4
  gap-4

  sm:grid-cols-6

  md:grid-cols-8
  md:gap-6

  lg:gap-8

  xl:grid-cols-12
  ${(p) =>
    clsx({
      "px-4 sm:px-8 md:px-6 lg:px-8": p["$padding"] ?? true,
    })}
`;
