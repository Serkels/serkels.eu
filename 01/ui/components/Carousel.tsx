//

import useMergedRef from "@react-hook/merged-ref";
import { useTimeoutEffect } from "@react-hookz/web";
import {
  AnimatePresence,
  LazyMotion,
  domAnimation,
  m,
  type Transition,
} from "framer-motion";
import {
  Children,
  forwardRef,
  useCallback,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type ForwardedRef,
} from "react";
import { tv } from "tailwind-variants";

//

export const Carousel = forwardRef<HTMLDivElement, CarouselProps>(
  function Banner(props, forwardedRef) {
    const { className } = props;
    const {
      items: slides,
      theme,
      index,
      handleNext,
      ...other_props
    } = useCarousel(props, forwardedRef);
    const { base, slide } = theme;
    const count = slides.length;
    const [, reset] = useTimeoutEffect(handleNext, 6_666);

    return (
      <LazyMotion features={domAnimation}>
        <div className={base({ className })} {...other_props}>
          <AnimatePresence>
            {slides.map((child, slide_index) =>
              slide_index === index ? (
                <m.div
                  key={slide_index}
                  aria-label={`slide ${slide_index + 1} of ${count}`}
                  className={slide()}
                  role="group"
                  transition={{
                    opacity: { duration: 0.2 },
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onAnimationComplete={reset}
                >
                  {child}
                </m.div>
              ) : null,
            )}
          </AnimatePresence>
        </div>
      </LazyMotion>
    );
  },
);
export default Carousel;
export interface CarouselProps extends ComponentPropsWithoutRef<"div"> {
  autoplay?: boolean;
  transition?: Transition;
}
export interface CarouselState extends ComponentPropsWithoutRef<"div"> {
  readonly index: number;
}
//

function useCarousel(
  props: CarouselProps,
  forwardedRef: ForwardedRef<HTMLDivElement>,
) {
  const { children } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  const metamoran_ref = useMergedRef(containerRef, forwardedRef);

  //

  const [{ index }, setState] = useState<CarouselState>({
    index: 0,
  } satisfies CarouselState);

  const items = Children.toArray(children);
  const count = items.length;

  // const active_index = 0;
  const loop = true;

  const handleNext = useCallback(() => {
    const idx = loop ? 0 : index;
    setState((state) => ({
      ...state,
      index: index + 1 === count ? idx : index + 1,
    }));
  }, [index, loop, count]);

  return {
    "aria-label": "carousel",
    theme: style(),
    handleNext,
    index,
    items,
    count,
    ref: metamoran_ref,
  };
}

//

const style = tv({
  base: ["relative"],
  slots: {
    slide: ["absolute", "inset-0", "flex", "items-center"],
  },
  variants: {},
  defaultVariants: {},
});
