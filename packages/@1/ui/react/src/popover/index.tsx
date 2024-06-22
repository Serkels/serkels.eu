//

import type { PopoverProps } from "react-aria-components";
import {
  Popover as AriaPopover,
  Dialog,
  OverlayArrow,
} from "react-aria-components";
import { tv } from "tailwind-variants";

//

export function Popover(props: PopoverProps) {
  return (
    <AriaPopover
      {...props}
      className={({ isEntering: is_entering, isExiting: is_exiting }) =>
        popover_classes({ is_entering, is_exiting })
      }
    />
  );
}

export interface PopoverMessageProps extends Omit<PopoverProps, "children"> {
  children: React.ReactNode;
}
export function PopoverMessage({ children, ...props }: PopoverMessageProps) {
  return (
    <AriaPopover
      {...props}
      className={({
        defaultClassName,
        isEntering: is_entering,
        isExiting: is_exiting,
      }) =>
        popover_classes({
          className: defaultClassName,
          is_entering,
          is_exiting,
        })
      }
    >
      <OverlayArrow>
        <svg
          className="fill-[#707070]"
          width={12}
          height={12}
          viewBox="0 0 12 12"
        >
          <path d="M0 0 L6 6 L12 0" />
        </svg>
      </OverlayArrow>
      <Dialog>{children}</Dialog>
    </AriaPopover>
  );
}

//

const popover_classes = tv({
  base: `
    placement-bottom:mt-2
    placement-top:mb-2
    group
    rounded-full
    bg-[#707070]
    px-6
    py-2
    text-white
    ring-1
    ring-black/10
    drop-shadow-lg
  `,
  variants: {
    is_entering: {
      true: `
        animate-in
        fade-in
        placement-bottom:slide-in-from-top-1
        placement-top:slide-in-from-bottom-1
        duration-200
        ease-out
      `,
    },
    is_exiting: {
      true: `
        animate-out
        fade-out
        placement-bottom:slide-out-to-top-1
        placement-top:slide-out-to-bottom-1
        duration-150
        ease-in
      `,
    },
  },
});
