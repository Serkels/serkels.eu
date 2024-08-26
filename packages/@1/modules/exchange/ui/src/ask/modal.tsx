//

import type { PropsWithChildren } from "react";
import {
  Dialog,
  DialogTrigger,
  Modal,
  ModalOverlay,
} from "react-aria-components";
import { createSlot } from "react-slotify";
import { tv } from "tailwind-variants";

//

export function Exchange_Ask_Modal({ children }: PropsWithChildren) {
  const { dialog, overlay } = modal();
  return (
    <DialogTrigger>
      <Exchange_Ask_Modal.Trigger.Renderer childs={children} />
      <ModalOverlay isDismissable={true} className={overlay()}>
        <Modal>
          <Dialog className={dialog()}>
            <Exchange_Ask_Modal.Dialog.Renderer childs={children} />
          </Dialog>
        </Modal>
      </ModalOverlay>
    </DialogTrigger>
  );
}

Exchange_Ask_Modal.Trigger = createSlot();
Exchange_Ask_Modal.Dialog = createSlot();

//

const modal = tv({
  base: "",
  slots: {
    dialog: `
      boder-[#00000017]
      flex
      min-h-[50vh]
      min-w-[75vw]
      flex-col
      items-stretch
      justify-center
      rounded-2xl
      border
      bg-white
      p-7
      text-black
      shadow-[10px_13px_24px_#00000033]
      sm:min-w-[50vw]
      sm:max-w-[75vw]
      md:min-w-[45vw]
      md:max-w-[50vw]
      lg:max-w-[25vw]
    `,
    overlay: `
      fixed
      left-0
      top-0
      z-50
      flex
      h-[var(--visual-viewport-height)]
      w-screen
      items-center
      justify-center
      bg-slate-500/50
    `,
  },
});
