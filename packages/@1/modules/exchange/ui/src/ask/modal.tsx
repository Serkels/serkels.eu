//

import { modal } from "@1.ui/react/modal/atom";
import type { PropsWithChildren } from "react";
import {
  Dialog,
  DialogTrigger,
  Modal,
  ModalOverlay,
} from "react-aria-components";
import { createSlot } from "react-slotify";

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
