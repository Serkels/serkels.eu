import { useRef, type PropsWithChildren } from "react";
import type { AriaPopoverProps } from "react-aria";
import { DismissButton, Overlay, usePopover } from "react-aria";
import type { OverlayTriggerState } from "react-stately";

type PopoverProps = PropsWithChildren<
  Omit<AriaPopoverProps, "popoverRef"> & {
    state: OverlayTriggerState;
  }
>;

export function Popover({
  children,
  state,
  offset = 8,
  ...props
}: PopoverProps) {
  console.log("Popover ?");
  const popoverRef = useRef(null);
  const { popoverProps, underlayProps, arrowProps, placement } = usePopover(
    {
      ...props,
      offset,
      popoverRef,
    },
    state,
  );

  return (
    <Overlay>
      <div {...underlayProps} className="underlay" />
      <div {...popoverProps} ref={popoverRef} className="popover">
        <svg {...arrowProps} className="arrow" data-placement={placement}>
          <path d="M0 0,L6 6,L12 0" />
        </svg>
        <DismissButton onDismiss={state.close} />
        {children}
        <DismissButton onDismiss={state.close} />
      </div>
    </Overlay>
  );
}
