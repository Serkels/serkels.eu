//

import { Exchange_Ask_Modal } from "@1.modules/exchange.ui/ask/modal";
import { button } from "@1.ui/react/button/atom";
import Link from "next/link";
import type { PropsWithChildren } from "react";

//

export function LoginDialog({ children }: PropsWithChildren) {
  return (
    <Exchange_Ask_Modal>
      {children}
      <Exchange_Ask_Modal.Dialog>
        <div className="flex flex-1 flex-col justify-center items-center space-y-10">
          <h1
            className={`
              mx-auto
              my-0
              text-center
              text-xl
              font-extrabold
            `}
          >
            Connectez vous pour démarrer un échange
          </h1>
          <div className="mx-auto text-center text-2xl">🤝</div>
          <Link className={button()} href="/">
            Se connecter
          </Link>
        </div>
      </Exchange_Ask_Modal.Dialog>
    </Exchange_Ask_Modal>
  );
}
