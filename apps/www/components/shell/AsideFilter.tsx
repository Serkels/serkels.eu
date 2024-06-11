//
"use client";
import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { tv, type VariantProps } from "tailwind-variants";
import { Provider } from "./AsideFilter.client";

//

export const AsideFilter = forwardRef<HTMLDivElement, Props>(
  function AsideFilter({ children, ...props }, forwardedRef) {
    const { className, "slot-title": Title, ...other_props } = props;
    const { article, title, base, sticky } = style();

    return (
      <section
        className={base({ className })}
        {...other_props}
        ref={forwardedRef}
      >
        <div className={sticky()}>
          <div className="overflow-y-auto md:pb-28">
            <h3 className={title()}>{Title}</h3>
            <Provider>
              <article className={article()}>{children}</article>
            </Provider>
          </div>
        </div>
      </section>
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
    title: "mb-7 pl-3 text-2xl font-bold uppercase text-Congress_Blue md:pl-0",
    article: "w-full",
  },
});
