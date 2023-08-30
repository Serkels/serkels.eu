"use client";

import type { PropsWithChildren } from "react";
import { createStateContext, useEffectOnce } from "react-use";
import { tv, type VariantProps } from "tailwind-variants";

//

const grid_style = tv({
  base: "grid min-h-screen grid-rows-[max-content_minmax(_0,_1fr_)_max-content]",
  variants: {
    fixed_frame: {
      true: "h-screen", //max-h-[calc(100vh_-_theme(spacing.16)-_theme(spacing.8))]",
    },
  },
});

export const [useLayout_, Layout_Provider_] = createStateContext<
  VariantProps<typeof grid_style>
>({ fixed_frame: false });

export const Layout_Provider = Layout_Provider_;
export const useLayout = useLayout_;

export function Layout_Grid({ children }: PropsWithChildren) {
  const [layout_variants] = useLayout();

  return <div className={grid_style(layout_variants)}>{children}</div>;
}

//

export function _set_fixed_page_layout() {
  const [, set_layout] = useLayout();

  useEffectOnce(() => {
    set_layout({ fixed_frame: true });
    return () => {
      set_layout({ fixed_frame: false });
    };
  });

  return null;
}
