"use client";

import {
  forwardRef,
  useCallback,
  type ComponentPropsWithoutRef,
  type ElementRef,
  type PropsWithChildren,
} from "react";
import { tv } from "tailwind-variants";

//

export const AppSidebar = forwardRef<
  ElementRef<"aside">,
  PropsWithChildren<
    ComponentPropsWithoutRef<"aside"> & { onClose?: () => void }
  >
>(function InputSearch(props, forwardedRef) {
  const { className, onClose, hidden, children, ...other_props } = props;
  const onCloseFn = useCallback(() => onClose && onClose(), [onClose]);
  const { base, container, close_button, close_icon, body } = aside_bar();
  return (
    <aside ref={forwardedRef} className={base({ className })} {...other_props}>
      <div
        className={container({ hidden })}
        tabIndex={-1}
        aria-labelledby="drawer-navigation-label"
      >
        <button
          onClick={onCloseFn}
          type="button"
          data-drawer-hide="drawer-navigation"
          aria-controls="drawer-navigation"
          className={close_button()}
        >
          <svg
            aria-hidden="true"
            className={close_icon()}
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            ></path>
          </svg>
          <span className="sr-only">Close menu</span>
        </button>
        <div className={body()}></div>
        {children}
      </div>
    </aside>
  );
});

const aside_bar = tv({
  base: "",
  slots: {
    container: `
      fixed
      left-0
      top-0
      z-40
      h-screen
      w-72
      overflow-y-auto
      bg-white
      transition-transform
    `,
    close_button: `
      absolute
      right-4
      top-4
      inline-flex
      items-center
      rounded-lg
      bg-transparent
      p-1.5
      text-sm
      text-[#707070]
      hover:bg-gray-200
      hover:text-gray-900
    `,
    close_icon: "h-6 w-6",
    body: "mt-20",
  },
  variants: {
    hidden: {
      true: { container: "-translate-x-full" },
    },
  },
});
