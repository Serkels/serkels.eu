//

import clsx from "clsx";
import type { PropsWithChildren, ReactNode } from "react";
import {
  Button,
  Dialog,
  DialogTrigger,
  OverlayArrow,
  Popover,
  type PopoverProps,
} from "react-aria-components";
import { Messenger } from "../icons";

//

function OverlayButton(props: any) {
  return (
    <Button
      {...props}
      className="
        data-[hovered]:
        data-[hovered]:
        inline-flex
        cursor-default
        items-center
        justify-center
        rounded-md
        px-3.5
        py-2
        font-medium
        text-white
        outline-none
        transition-colors
        data-[hovered]:border
        data-[hovered]:border-white/20
        data-[hovered]:bg-black
        data-[hovered]:bg-opacity-30
        data-[pressed]:bg-opacity-40
        data-[hovered]:bg-clip-padding
        data-[focus-visible]:ring-2
        data-[focus-visible]:ring-white/75
        sm:text-sm
      "
    />
  );
}

export function DropdownButton({
  children,
  label,
  "slot-OverlayButton": slotOverlayButton,
}: PropsWithChildren<{ label: string; "slot-OverlayButton": ReactNode }>) {
  return (
    <DialogTrigger>
      <OverlayButton aria-label={label}>{slotOverlayButton}</OverlayButton>
      <MyPopover
        className="
          group
          hidden
          w-[280px]
          data-[placement=bottom]:mt-2
          data-[placement=top]:mb-2
          md:block
        "
      >
        <OverlayArrow>
          <svg
            viewBox="0 0 12 12"
            className="block h-4 w-4 fill-white group-data-[placement=bottom]:rotate-180"
          >
            <path d="M0 0,L6 6,L12 0" />
          </svg>
        </OverlayArrow>
        <Dialog className="p-2 text-gray-700 outline-none">{children}</Dialog>
      </MyPopover>
    </DialogTrigger>
  );
}

export function Notification({ avatar, name, time, text, href }: any) {
  return (
    <a
      href={href}
      className="grid grid-cols-[theme(width.5)_1fr_theme(width.4)] gap-x-2 rounded-lg p-2 hover:bg-gray-100"
    >
      <img src={avatar} className="row-span-3 h-5 w-5 rounded-full" />
      <div className="text-sm font-semibold text-gray-800">{name}</div>
      <Messenger className="h-4 w-4 stroke-2 text-gray-400" />
      <div className="col-span-2 text-xs text-gray-500">
        Commented {time} ago
      </div>
      <p className="col-span-2 mt-1 line-clamp-2 overflow-hidden text-ellipsis text-xs">
        {text}
      </p>
    </a>
  );
}

function MyPopover(props: PopoverProps) {
  return (
    <Popover
      {...props}
      className={({ isEntering, isExiting }) =>
        clsx(
          `
          rounded-lg
          bg-white
          px-4
          ring-1
          ring-black/10
          drop-shadow-lg
          sm:px-0
        `,
          props.className,
          {
            "duration-200 ease-out animate-in fade-in fill-mode-forwards data-[placement=bottom]:slide-in-from-top-1 data-[placement=top]:slide-in-from-bottom-1":
              isEntering,
            "duration-150 ease-in animate-out fade-out fill-mode-forwards data-[placement=bottom]:slide-out-to-top-1 data-[placement=top]:slide-out-to-bottom-1":
              isExiting,
          },
        )
      }
    />
  );
}

export function EmptyNotification({ children }: PropsWithChildren) {
  return (
    <div className="flex flex-col items-center justify-center p-5">
      {children}
    </div>
  );
}
