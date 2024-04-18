//

import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { tv, type VariantProps } from "tailwind-variants";

//

export const AsideFilter = forwardRef<HTMLDivElement, Props>(
  function AsideFilter({ children, ...props }, forwardedRef) {
    const { className, "slot-title": Title, ...other_props } = props;
    const { article, title, base, sticky } = style();

    return (
      <aside
        className={base({ className })}
        {...other_props}
        ref={forwardedRef}
      >
        <div className={sticky()}>
          <div className="max-h-screen overflow-y-auto pb-28 pr-8">
            <h3 className={title()}>{Title}</h3>
            <article className={article()}>{children}</article>
          </div>
        </div>
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
    sticky: "sticky top-16 pt-10",
    title: "mb-7 text-2xl font-bold uppercase text-Congress_Blue",
    article: "pt-10",
  },
});
