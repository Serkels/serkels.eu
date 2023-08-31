//

import { Button } from "@1/ui/components/ButtonV";
import { Spinner } from "@1/ui/components/Spinner";
import * as UI from "@1/ui/domains/exchange/AskModal";
import { OnlineOrLocation } from "@1/ui/domains/exchange/OnlineOrLocation";
import { Exchange as ExchangeIcon, Share } from "@1/ui/icons";
import { Formik } from "formik";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useContext, useEffect, useRef } from "react";
import { useTimeoutFn } from "react-use";
import { P, match } from "ts-pattern";
import { Avatar } from "~/components/Avatar";
import { ErrorOccur } from "~/components/ErrorOccur";
import { useExchange_item_controller } from "~/modules/exchange";
import { Deal_Controller } from "~/modules/exchange/Deal.controller";
import { Deal_Repository } from "~/modules/exchange/Deal.repository";
import { Deal_Message_Controller } from "~/modules/exchange/Deal_Message.controller";
import { Deal_Message_Repository } from "~/modules/exchange/Deal_Message.repository";
import { fromClient } from "../api/v1";
import { Exchange_CardContext } from "./ExchangeCard.context";

//

export function Ask_Action() {
  const { exchange } = useContext(Exchange_CardContext);

  return (
    <UI.DialogTrigger>
      {exchange.in_exchange_of ? (
        <Button intent="warning">Échanger</Button>
      ) : (
        <Button>Demander</Button>
      )}

      <UI.Modal>
        <UI.Dialog>
          <Ask_Body />
        </UI.Dialog>
      </UI.Modal>
    </UI.DialogTrigger>
  );
}

export function Ask_Body() {
  const { exchange } = useContext(Exchange_CardContext);
  const exchange_id = exchange.get("id");

  const { data: session } = useSession();

  const { find_deal_by_participant } = useExchange_item_controller(exchange_id);

  const {
    create: { useMutation },
  } = new Deal_Controller(new Deal_Repository(fromClient, session?.user?.jwt));

  const exchange_deals_query_info = find_deal_by_participant.useQuery();
  const deal_id = exchange_deals_query_info.data?.data?.at(0)?.id;

  const message_ctrl = new Deal_Message_Controller(
    new Deal_Message_Repository(
      fromClient,
      session?.user?.jwt,
      Number(deal_id),
    ),
  );
  const create_message_info = message_ctrl.create.useMutation();

  const create_deal_mutation_info = useMutation();

  const message_ref = useRef<string>();

  //
  //
  //

  useEffect(() => {
    if (
      !deal_id ||
      !create_deal_mutation_info.isSuccess ||
      !message_ref.current
    )
      return;

    console.log(
      {
        exchange_deals: exchange_deals_query_info,
        create_deal_mutation_info,
        create_message_info,
      },
      message_ref.current,
    );

    create_message_info.mutate(message_ref.current);
  }, [create_deal_mutation_info.isSuccess, deal_id, message_ref.current]);

  return (
    match([
      create_message_info,
      exchange_deals_query_info,
      create_deal_mutation_info,
    ])
      .with(
        [{ status: "error" }, P._, P._],
        [P._, { status: "error" }, P._],
        [P._, P._, { status: "error" }],
        () => {
          const error =
            create_message_info.error ??
            exchange_deals_query_info.error ??
            create_deal_mutation_info.error;
          return <ErrorOccur error={error as Error} />;
        },
      )
      .with([P._, P._, { status: "loading" }], () => <Sending />)
      .with(
        [{ status: "loading" }, P._, P._],
        [P._, { status: "loading" }, P._],
        () => <Loading />,
      )
      .with(
        [
          { status: "idle" },
          {
            status: "success",
            data: { data: [P.select()] },
          },
          { status: "idle" },
        ],
        ({ id }) => <RedirectToExistingDeal deal_id={id!} />,
      )
      //
      .with(
        [P._, P._, { status: "idle", mutateAsync: P.select() }],
        (mutateAsync) => (
          <Ask_Form
            onSend={async (message) => {
              message_ref.current = message;
              await mutateAsync({ exchange_id });
              await exchange_deals_query_info.refetch();
            }}
          />
        ),
      )
      .with([{ status: "success" }, P._, P._], () => <MessageSent />)
      .with([{ status: "idle" }, { status: "success" }, P._], (i) => {
        console.warn(i);
        return <Loading />;
      })
      .exhaustive()
  );
}

function Sending() {
  return (
    <div className="flex flex-1 flex-col justify-center">
      <h1
        className={`
        mx-auto
        my-0
        text-center 
        text-xl
        font-extrabold
      `}
      >
        Envoie en cours...
      </h1>
      <div className="mx-auto mt-5 text-center">
        <Spinner />
      </div>
    </div>
  );
}

function Loading() {
  return (
    <div className="flex flex-1 flex-col justify-center">
      <h1
        className={`
        mx-auto
        my-0
        text-center 
        text-xl
        font-extrabold
      `}
      >
        Chargement...
      </h1>
      <div className="mx-auto mt-5 text-center">
        <Spinner />
      </div>
    </div>
  );
}

function MessageSent() {
  const state = UI.useDialogContext();

  useTimeoutFn(state.onClose ?? (() => {}), 3_333);

  return (
    <div className="flex flex-1 flex-col justify-center">
      <h1
        className={`
          mx-auto
          my-0
          text-center 
          text-xl
          font-extrabold
        `}
      >
        Message envoyé
      </h1>
      <div className="mx-auto mt-5 text-center">📮</div>
    </div>
  );
}

function RedirectToExistingDeal({ deal_id }: { deal_id: number }) {
  const { exchange } = useContext(Exchange_CardContext);

  return (
    <Link
      className="flex flex-1 flex-col items-center justify-center"
      href={`/my/exchanges/${exchange.get("id")}/deals/${deal_id}`}
    >
      <ExchangeIcon
        className={`
          max-w-[50%]
          flex-1
        `}
      />
      <div className="mx-auto mt-5 text-center">C'est par là :D</div>
    </Link>
  );
}

export function Ask_Form({ onSend }: { onSend: (message: string) => void }) {
  const { exchange } = useContext(Exchange_CardContext);

  return (
    <>
      <UI.NotImplemented>
        <h3 className="text-2xl font-bold">{exchange.title}</h3>
      </UI.NotImplemented>
      <UI.NotImplemented>
        <OnlineOrLocation
          is_online={exchange.is_online}
          location={exchange.location}
        />
      </UI.NotImplemented>
      <UI.NotImplemented>
        <time
          className="mt-3 text-xs"
          dateTime={exchange.updatedAt.toUTCString()}
          title={exchange.updatedAt.toUTCString()}
        >
          {exchange.updatedAt.toLocaleDateString("fr")}
        </time>
      </UI.NotImplemented>
      <UI.NotImplemented>
        <UI.ProposedByFigure
          avatar={
            <Avatar className="h-12 w-12" u={exchange.profile.get("id")} />
          }
          label={"Proposé par :"}
        >
          {exchange.profile.name}
        </UI.ProposedByFigure>
      </UI.NotImplemented>

      <Formik
        initialValues={{ message: "" }}
        onSubmit={(value) => onSend(value.message)}
      >
        {({ isSubmitting }) => (
          <UI.Form>
            <UI.Textarea
              name="message"
              disabled={isSubmitting}
              placeholder="Bonjour ! Je veux bien apprendre le français avec toi !"
            />
            <Button
              type="submit"
              isDisabled={isSubmitting}
              className="mx-auto flex space-x-3"
            >
              <span>Envoyer</span> <Share className="h-4 w-4" />
            </Button>
          </UI.Form>
        )}
      </Formik>
    </>
  );
}
