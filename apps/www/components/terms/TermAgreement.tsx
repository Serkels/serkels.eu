"use client";

import { useSession } from "@1.modules/auth.next/react";
import { Dialog, DialogTrigger, Modal, ModalOverlay } from "@1.ui/react/aria";
import { Button } from "@1.ui/react/button";
import { modal } from "@1.ui/react/modal/atom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { tv } from "tailwind-variants";
import { useTerm } from "./context";

//

const EXCLUDED_PATHS = [
  "/confidentiality",
  "/faq",
  "/legal",
  "/notices",
  "/status",
  "/who",
];

export function TermAgreement() {
  const { dialog, overlay } = modal();
  const { has_signed, accept, decline } = useTerm();
  const { link } = terms();
  const pathname = usePathname();
  const excluded_path = EXCLUDED_PATHS.includes(pathname);
  const { status } = useSession();
  const is_authenticated = status === "authenticated";
  //

  if (has_signed || excluded_path || is_authenticated) return null;

  return (
    <DialogTrigger>
      <ModalOverlay isDismissable={false} isOpen={true} className={overlay()}>
        <Modal>
          <Dialog className={dialog()}>
            <h1 className="pt-4 sm:px-4">Conditions générales d'utilisation</h1>
            <section className="flex flex-grow items-center">
              <p className="text-center leading-8 sm:px-16">
                En poursuivant, vous acceptez les{" "}
                <Link className={link()} href="/legal">
                  conditions générales d'utilisation
                </Link>{" "}
                ainsi que la{" "}
                <Link className={link()} href="/confidentiality">
                  politique de confidentialité
                </Link>{" "}
                de Serkels.
              </p>
            </section>
            <div className="grid w-full grid-cols-2 items-center justify-items-center">
              <div className="w-2/3 lg:w-1/2">
                <Button
                  className="w-full"
                  onPress={decline}
                  variant={{ intent: "light" }}
                >
                  Refuser
                </Button>
              </div>
              <div className="w-2/3 lg:w-1/2">
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

const terms = tv({
  base: "",
  slots: {
    link: "text-md text-center underline hover:text-secondary",
  },
});
