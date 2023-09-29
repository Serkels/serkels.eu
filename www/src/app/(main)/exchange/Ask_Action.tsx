//

import { UnknownError } from "@1/core/error";
import { useContainer, useInject } from "@1/core/ui/di.context.client";
import { Button } from "@1/ui/components/ButtonV";
import { Spinner } from "@1/ui/components/Spinner";
import * as UI from "@1/ui/domains/exchange/AskModal";
import { OnlineOrLocation } from "@1/ui/domains/exchange/OnlineOrLocation";
import { Exchange as ExchangeIcon, Share } from "@1/ui/icons";
import type { UseMutationResult } from "@tanstack/react-query";
import { Formik } from "formik";
import Link from "next/link";
import Nest from "react-nest";
import { createStateContext, useTimeoutFn } from "react-use";
import { P, match } from "ts-pattern";
import { Link_Avatar } from "~/components/Avatar";
import { Deal_Controller } from "~/modules/exchange/Deal.controller";
import { Deal_Message_Controller } from "~/modules/exchange/Deal_Message.controller";
import { Deal_Message_Repository } from "~/modules/exchange/Deal_Message.repository";
import { useExchange_Value } from "~/modules/exchange/Exchange.context";
import { Get_Deals_UseCase } from "~/modules/exchange/application/get_deals.use-case";
import { useMyProfileId } from "~/modules/user/useProfileId";
// import { Exchange_CardContext } from "./ExchangeCard.context";

//

const [useOutlet_Context, Outlet_Provider] = createStateContext<
  | { state: "idle" }
  | { state: "redirect"; deal_id: number }
  | {
      state: "form";
      create_deal: UseMutationResult<
        void,
        unknown,
        {
          exchange_id: number;
        }
      >;
    }
  | {
      state: "sending message";
      message: string;
      deal_id: number;
    }
  | { state: "sent" }
  | { state: "creating deal"; message: string }
>({
  state: "idle",
});

//

export function Ask_Action() {
  const [exchange] = useExchange_Value();

  return (
    <UI.DialogTrigger>
      {exchange.get("in_exchange_of") ? (
        <Button intent="warning">Échanger</Button>
      ) : (
        <Button>Demander</Button>
      )}

      <Nest>
        <UI.Modal />
        <UI.Dialog />
        <Outlet_Provider />
        <Ask_Body />
      </Nest>
    </UI.DialogTrigger>
  );
}

function Ask_Body() {
  const [context] = useOutlet_Context();

  return match(context)
    .with({ state: "idle" }, () => <LookForExistingDeal />)
    .with({ state: "form" }, () => <Ask_Form />)
    .with({ state: "creating deal" }, () => <CreatingDeal />)
    .with({ state: "sending message" }, () => <Sending />)
    .with({ state: "sent" }, () => <MessageSent />)
    .with({ state: "redirect", deal_id: P.select() }, (deal_id) => (
      <RedirectToExistingDeal deal_id={deal_id} />
    ))
    .exhaustive();
}

function LookForExistingDeal() {
  const [, setContext] = useOutlet_Context();
  const [exchange] = useExchange_Value();

  const info = useInject(Get_Deals_UseCase).execute(
    Number(exchange.id.value()),
    {
      pagination: { pageSize: 5 },
      sort: ["updatedAt:desc"],
    },
  );

  const {
    create: { useMutation },
  } = useInject(Deal_Controller);
  const create_deal_mutation_info = useMutation();

  return match(info)
    .with({ status: "loading" }, () => <Loading />)
    .with({ status: "error", error: P.select() }, (error) => {
      throw error;
    })
    .with({ status: "success", data: P.select() }, (data) => {
      const deal_id = data.pages.at(0);
      setTimeout(() => {
        setContext(
          deal_id
            ? { state: "redirect", deal_id }
            : { state: "form", create_deal: create_deal_mutation_info },
        );
      }, 0);
      return null;
    })
    .exhaustive();
}

function CreatingDeal() {
  const [context, setContext] = useOutlet_Context();
  const [exchange] = useExchange_Value();

  if (context.state !== "creating deal") {
    throw new UnknownError("State missmatch", { props: { context } });
  }

  //

  const exchange_id = Number(exchange.id.value());

  const {
    create: { useMutation },
  } = useInject(Deal_Controller);

  const create_deal_mutation_info = useMutation();
  const exchange_deals_query_info = useInject(Get_Deals_UseCase).execute(
    exchange_id,
    { pagination: { pageSize: 1 }, sort: ["updatedAt:desc"] },
  );

  useTimeoutFn(async () => {
    await create_deal_mutation_info.mutateAsync({
      exchange_id,
    });

    const { status, data, error } = await exchange_deals_query_info.refetch();
    if (status !== "success") {
      throw new UnknownError("Deal not created", { cause: error });
    }

    const deal_id = data.pages.at(0);
    if (!deal_id) {
      throw new UnknownError("Deal not found", { cause: error });
    }

    setContext({ state: "sending message", message: context.message, deal_id });
  }, 0);

  //

  return <SendingInProgress />;
}

function Sending() {
  const [context, setContext] = useOutlet_Context();

  if (context.state !== "sending message") {
    throw new UnknownError("State missmatch", { props: { context } });
  }

  //

  useContainer().registerInstance(
    Deal_Message_Repository.DEAL_ID_TOKEN,
    context.deal_id,
  );

  const message_ctrl = useInject(Deal_Message_Controller);
  const create_message_info = message_ctrl.create.useMutation();

  useTimeoutFn(async () => {
    await create_message_info.mutate(context.message);
    setContext({ state: "sent" });
  }, 0);

  //

  return <SendingInProgress />;
}

function SendingInProgress() {
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
  const id = useMyProfileId();
  const [exchange] = useExchange_Value();

  return (
    <Link
      className="flex flex-1 flex-col items-center justify-center"
      href={`/@${id}/my/exchanges/${exchange.id.value()}/deals/${deal_id}`}
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

function Ask_Form() {
  const [, setContext] = useOutlet_Context();
  const [exchange] = useExchange_Value();

  return (
    <>
      <h3
        className="my-5 line-clamp-2 text-2xl font-bold"
        title={exchange.get("title")}
      >
        {exchange.get("title")}
      </h3>
      <div className="my-2  flex flex-row justify-between">
        <OnlineOrLocation
          is_online={exchange.get("is_online")}
          location={exchange.get("location")}
        />
        <time
          className="mt-3 text-xs"
          dateTime={exchange.get("updatedAt").toUTCString()}
          title={exchange.get("updatedAt").toUTCString()}
        >
          {exchange.get("updatedAt").toLocaleDateString("fr")}
        </time>
      </div>

      <div className="flex flex-row">
        <UI.ProposedByFigure
          avatar={
            <Link_Avatar
              className="h-12 w-12"
              u={exchange.get("profile").get("id")}
            />
          }
          label={"Proposé par :"}
        >
          {exchange.get("profile").name}
        </UI.ProposedByFigure>
      </div>

      <Formik
        initialValues={{ message: "" }}
        onSubmit={(value) =>
          setContext({ state: "creating deal", message: value.message })
        }
      >
        {({ isSubmitting }) => (
          <UI.Form>
            <UI.Textarea
              name="message"
              rows={9}
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
