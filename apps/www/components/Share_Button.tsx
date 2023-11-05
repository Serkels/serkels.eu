"use client";
import { Button } from "@1.ui/react/button";
import { popover } from "@1.ui/react/popover/atom";
import { useTimeoutEffect, useToggle } from "@react-hookz/web";
import { useCallback, type PropsWithChildren } from "react";

export function Share_Button({
  href,
  children,
  className,
}: PropsWithChildren<{ className?: string; href: string }>) {
  const [diplay_in_clipboard, set_diplay_in_clipboard] = useToggle(false);
  const [, reset] = useTimeoutEffect(
    () => set_diplay_in_clipboard(false),
    5000,
  );
  const copy_to_clipboard = useCallback(async () => {
    await navigator.clipboard.writeText(href);
    set_diplay_in_clipboard(true);
    reset();
  }, [href]);

  return (
    <div className="relative">
      {diplay_in_clipboard ? (
        <div className={popover()}>Copié dans le Presse-papiers</div>
      ) : null}
      <Button
        state="ghost"
        intent="light"
        size="md"
        className={className}
        onPress={copy_to_clipboard}
      >
        {children}
      </Button>
    </div>
  );
}
