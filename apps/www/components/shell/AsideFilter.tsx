//
"use client";
import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { tv, type VariantProps } from "tailwind-variants";
import { Provider } from "./AsideFilter.client";

//

export const AsideFilter = forwardRef<HTMLDivElement, Props>(
  function AsideFilter({ children, ...props }, forwardedRef) {
    const {
      className,
      "slot-title": Title,
      subtitle: Subtitle,
      ...other_props
    } = props;
    const { article, title, base, body, sticky, subtitle } = style();

    return (
      <section
        className={base({ className })}
        {...other_props}
        ref={forwardedRef}
      >
        <div className={sticky()}>
          <div className={body()}>
            <h3 className={title()}>{Title}</h3>
            <p className={subtitle()}>{Subtitle}</p>
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
  subtitle?: React.ReactNode;
}

//

const style = tv({
  base: "",
  slots: {
    sticky: "sticky top-16 pt-10",
    body: "verflow-y-auto mx-auto max-w-[333px] md:pb-28",
    title: "pl-3 text-2xl font-bold uppercase text-Congress_Blue md:pl-0",
    subtitle: "w-full px-4 pb-6 pt-4 text-base md:px-0",
    article: "w-full",
  },
});
