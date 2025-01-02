//

import useMergedRef from "@react-hook/merged-ref";
import { useTimeoutEffect } from "@react-hookz/web";
import {
  AnimatePresence,
  LazyMotion,
  domAnimation,
  m,
  type Transition,
} from "motion/react";
import {
  Children,
  forwardRef,
  useCallback,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type ForwardedRef,
  type PropsWithChildren,
} from "react";
import { tv } from "tailwind-variants";
import { VisuallyHidden } from "../visually_hidden";

//

export const Carousel = forwardRef<HTMLDivElement, CarouselProps>(
  function Banner(props, forwardedRef) {
    const { className } = props;
    const {
      items: slides,
      theme,
      index,
      handle_jump_to,
      handle_next,
      ...other_props
    } = useCarousel(props, forwardedRef);
    const { base, slide } = theme;
    const count = slides.length;
    const [, reset] = useTimeoutEffect(handle_next, 6_666);

    const jump_to = useCallback(
      (slide_index: number) => {
        handle_jump_to(slide_index);
        reset();
      },
      [handle_next, reset],
    );

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
          <Jump_Button_Group values={{ count, index, jump_to }} />
        </div>
      </LazyMotion>
    );
  },
);

function Jump_Button_Group({
  values: { count, index, jump_to },
}: {
  values: { count: number; index: number; jump_to: (index: number) => void };
}) {
  const { base, circle } = button_group();
  return (
    <div className={base()}>
      {Array.from({ length: count }).map((_, slide_index) => (
        <button
          className={circle({ active: slide_index === index })}
          key={slide_index}
          onClick={() => jump_to(slide_index)}
        >
          <VisuallyHidden>Jump to slide {slide_index}</VisuallyHidden>
        </button>
      ))}
    </div>
  );
}

const button_group = tv({
  base: `absolute bottom-0 mb-4 flex w-full items-center justify-center space-x-2`,
  slots: {
    circle: `h-2 w-2 rounded-full bg-white opacity-60`,
  },
  variants: {
    active: {
      true: { circle: `opacity-1` },
    },
  },
});

export default Carousel;
export interface CarouselProps
  extends PropsWithChildren,
    Omit<ComponentPropsWithoutRef<"div">, "children"> {
  autoplay?: boolean;
  transition?: Transition;
  actions?: {
    next: () => void;
  };
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

  const handle_next = useCallback(() => {
    const idx = loop ? 0 : index;
    setState((state) => ({
      ...state,
      index: index + 1 === count ? idx : index + 1,
    }));
  }, [index, loop, count]);

  const handle_jump_to = useCallback((index: number) => {
    setState((state) => ({ ...state, index }));
  }, []);

  return {
    "aria-label": "carousel",
    theme: style(),
    handle_jump_to,
    handle_next,
    index,
    items,
    count,
    ref: metamoran_ref,
  };
}

//

const style = tv({
  base: "relative",
  slots: {
    slide: "absolute inset-0 flex items-center",
  },
});
