"use client";

import { Dialog, DialogTrigger, Modal, ModalOverlay } from "@1.ui/react/aria";
import { Button } from "@1.ui/react/button";
import { modal } from "@1.ui/react/modal/atom";
import { useTerm } from "./context";

//

export function TermAgreement() {
  const { dialog, overlay } = modal();
  const { has_signed, accept } = useTerm();

  //

  if (has_signed) return null;

  return (
    <DialogTrigger>
      <ModalOverlay isDismissable={false} isOpen={true} className={overlay()}>
        <Modal>
          <Dialog className={dialog()}>
            <h1>Conditions générales d'utilisation</h1>
            <section className="flex-grow">
              <p>
                En vous connectant, vous acceptez les conditions générales
                d'utilisation de Serkels.
              </p>
            </section>
            <div className="grid grid-cols-2">
              <div>
                <Button
                  className="w-full"
                  onPress={accept}
                  variant={{ intent: "light" }}
                >
                  Refuser
                </Button>
              </div>
              <div>
                <Button className="w-full" onPress={accept}>
                  Accepter
                </Button>
              </div>
            </div>
          </Dialog>
        </Modal>
      </ModalOverlay>
    </DialogTrigger>
  );
}
