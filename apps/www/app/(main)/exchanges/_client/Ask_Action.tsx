"use client";

import { SeeProfileAvatarMedia } from ":components/avatar";
import type { Exchange } from "@1.modules/exchange.domain";
import {
  Outlet_Provider,
  useOutlet_Context,
  useOutlet_Exchange,
  useOutlet_RequireContext,
  useOutlet_Send,
} from "@1.modules/exchange.ui/ask/context";
import { Ask_Form } from "@1.modules/exchange.ui/ask/form";
import { Exchange_Ask_Modal } from "@1.modules/exchange.ui/ask/modal";
import { SendingInProgress } from "@1.modules/exchange.ui/ask/sending";
import { MessageSent } from "@1.modules/exchange.ui/ask/sent";
import { useTimeoutEffect } from "@react-hookz/web";
import { type PropsWithChildren } from "react";
import { createSlot } from "react-slotify";
import { P, match } from "ts-pattern";

//

//

export function Ask_Action({
  children,
  exchange,
}: PropsWithChildren<{ exchange: Exchange }>) {
  return (
    <Exchange_Ask_Modal>
      <Exchange_Ask_Modal.Trigger>
        <Ask_Action.Trigger.Renderer childs={children}>
          ...
        </Ask_Action.Trigger.Renderer>
      </Exchange_Ask_Modal.Trigger>
      <Exchange_Ask_Modal.Dialog>
        <Outlet_Provider exchange={exchange}>
          <Ask_Body></Ask_Body>
        </Outlet_Provider>
      </Exchange_Ask_Modal.Dialog>
    </Exchange_Ask_Modal>
  );
}

Ask_Action.Trigger = createSlot();

//

function Ask_Body() {
  const context = useOutlet_Context();
  const exchange = useOutlet_Exchange();
  console.log({ context });
  return (
    match(context)
      .with({ state: "idle" }, () => (
        <Ask_Form>
          <Ask_Form.AvatarFigure>
            <SeeProfileAvatarMedia profile={exchange.owner.profile} />
          </Ask_Form.AvatarFigure>
        </Ask_Form>
      ))
      .with({ state: "creating deal" }, () => <MessageSent />)
      .with({ state: "sending message" }, () => <Sending />)
      .with({ state: "sent" }, () => <MessageSent />)
      .with(P._, () => <>Nope</>)
      // .with({ state: "form" }, () => <Ask_Form />)
      // .with({ state: "creating deal" }, () => <CreatingDeal />)
      // .with({ state: "sent" }, () => <MessageSent />)
      // .with({ state: "redirect", deal_id: P.select() }, (deal_id) => (
      //   <RedirectToExistingDeal deal_id={deal_id} />
      // ))
      .exhaustive()
  );
}

//

function Sending() {
  const context = useOutlet_RequireContext({ state: "sending message" });
  const send = useOutlet_Send();

  //

  // const create_message_info = TRPC_React.

  useTimeoutEffect(async () => {
    // await create_message_info.mutate(context.message);
    send({ state: "sent" });
  }, 1_111);

  //

  return <SendingInProgress />;
}

// function Ask_Form() {
//   const exchange = useOutlet_Exchange();
//   return (
//     <>
//       <h3
//         className="my-5 line-clamp-2 text-2xl font-bold"
//         title={exchange.title}
//       >
//         {exchange.title}
//       </h3>{" "}
//       {exchange.id}
//     </>
//   );
// }
