//

import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { tv, type VariantProps } from "tailwind-variants";

//

export const AsideFilter = forwardRef<HTMLDivElement, Props>(
  function AsideFilter({ children, ...props }, forwardedRef) {
    const { className, "slot-title": Title, ...other_props } = props;
    const { article, title, base } = style();

    return (
      <aside
        className={base({ className })}
        {...other_props}
        ref={forwardedRef}
      >
        <h3 className={title()}>{Title}</h3>
        <article className={article()}>{children}</article>
      </aside>
    );
  },
);

export interface Props
  extends ComponentPropsWithoutRef<"div">,
    VariantProps<typeof style> {
  "slot-title": React.ReactNode;
}

//

const style = tv({
  base: "",
  slots: {
    title: "mb-7 text-2xl font-bold uppercase text-Congress_Blue",
    article: "pt-10",
  },
});
