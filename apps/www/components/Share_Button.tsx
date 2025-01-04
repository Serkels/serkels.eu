"use client";

import { DialogTrigger } from "@1.ui/react/aria";
import { button } from "@1.ui/react/button/atom";
import { PopoverMessage } from "@1.ui/react/popover";
import { sendGAEvent } from "@next/third-parties/google";
import { useTimeoutEffect, useToggle } from "@react-hookz/web";
import { useCallback, useRef, type PropsWithChildren } from "react";

//

export function Share_Button({
  href,
  children,
}: PropsWithChildren<{
  className?: string;
  href: string;
}>) {
  const [diplay_in_clipboard, set_diplay_in_clipboard] = useToggle(false);
  const trigger_ref = useRef(null);

  const [, reset] = useTimeoutEffect(
    () => set_diplay_in_clipboard(false),
    5_000,
  );
  const copy_to_clipboard = useCallback(async () => {
    if (!navigator.clipboard) return;
    await navigator.clipboard.writeText(
      href.startsWith("/") ? `${window.location.origin}${href}` : href,
    );
    set_diplay_in_clipboard(true);
    sendGAEvent({
      event: "share",
      value: href,
    });
    reset();
  }, [href]);

  return (
    <DialogTrigger>
      <button
        ref={trigger_ref}
        className={button({ intent: "light", className: "h-11 p-2" })}
        onClick={copy_to_clipboard}
      >
        {children}
      </button>
      <PopoverMessage
        triggerRef={trigger_ref}
        placement="top"
        isOpen={diplay_in_clipboard}
        onOpenChange={set_diplay_in_clipboard}
      >
        Le lien est copié
      </PopoverMessage>
    </DialogTrigger>
  );
}
