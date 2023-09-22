//

import { Button } from "@1/ui/components/ButtonV";
import { Spinner } from "@1/ui/components/Spinner";
import * as UI from "@1/ui/domains/exchange/AskModal";
import { OnlineOrLocation } from "@1/ui/domains/exchange/OnlineOrLocation";
import { Exchange as ExchangeIcon, Share } from "@1/ui/icons";
import { Formik } from "formik";
import Link from "next/link";
import { useContext, useEffect, useMemo, useRef } from "react";
import { useTimeoutFn } from "react-use";
import { P, match } from "ts-pattern";
import { Link_Avatar } from "~/components/Avatar";
import { ErrorOccur } from "~/components/ErrorOccur";
import { useContainer, useInject } from "~/core/react";
import { Deal_Controller } from "~/modules/exchange/Deal.controller";
import { Deal_Message_Controller } from "~/modules/exchange/Deal_Message.controller";
import { Deal_Message_Repository } from "~/modules/exchange/Deal_Message.repository";
import { Get_Deals_UseCase } from "~/modules/exchange/application/get_deals.use-case";
import { useMyProfileId } from "~/modules/user/useProfileId";
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
  const exchange_deals_query_info =
    useInject(Get_Deals_UseCase).execute(exchange_id);

  const {
    create: { useMutation },
  } = useInject(Deal_Controller);

  const deal_id = exchange_deals_query_info.data?.pages.at(0);
  const injector = useContainer();
  const container = useMemo(() => {
    return injector
      .createChildContainer()
      .register<number>(Deal_Message_Repository.DEAL_ID_TOKEN, {
        useFactory: () => deal_id ?? NaN,
      });
  }, [deal_id]);
  const message_ctrl = container.resolve(Deal_Message_Controller);

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

    create_message_info.mutate(message_ref.current);
  }, [create_deal_mutation_info.isSuccess, deal_id, message_ref.current]);

  console.log([
    create_message_info,
    exchange_deals_query_info,
    create_deal_mutation_info,
  ]);
  console.log([
    create_message_info.status,
    exchange_deals_query_info.status,
    create_deal_mutation_info.status,
  ]);
  const merged_mutations = {
    status: match([
      create_message_info.status,
      exchange_deals_query_info.status,
      create_deal_mutation_info.status,
    ])
      .with(
        ["error", P._, P._],
        [P._, "error", P._],
        [P._, P._, "error"],
        () => "error" as const,
      )
      .with(
        ["loading", P._, P._],
        [P._, "loading", P._],
        () => "loading" as const,
      )
      .with([P._, P._, "loading"], () => "sending" as const)
      .with(["success", P._, P._], () => "sent" as const)
      .with(["idle", "success", P.not("idle")], () => "loading" as const)
      .with(["idle", "success", "success"], () => "loading" as const)
      .with(["idle", "success", "idle"], () => "redirect" as const)
      .with([P._, P._, "success"], () => "success" as const)
      .otherwise(() => "idle" as const),
    error:
      create_message_info.error ||
      exchange_deals_query_info.error ||
      create_deal_mutation_info.error,
    deal_id,
  };
  console.log({ merged_mutations });

  return match(merged_mutations)
    .with({ status: "error", error: P.select() }, (error) => (
      <ErrorOccur error={error as Error} />
    ))
    .with({ status: "loading" }, () => <Loading />)
    .with({ status: "sending" }, () => <Sending />)
    .with({ status: "sent" }, () => <MessageSent />)
    .with({ status: "success" }, () => null)
    .with({ status: "redirect", deal_id: P.select(P.not(P.nullish)) }, (id) => (
      <RedirectToExistingDeal deal_id={id!} />
    ))

    .with({ status: "redirect" }, { status: "idle" }, () => (
      <Ask_Form
        onSend={async (message) => {
          message_ref.current = message;
          await create_deal_mutation_info.mutateAsync({ exchange_id });
          await exchange_deals_query_info.refetch();
        }}
      />
    ))
    .exhaustive();
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
  const id = useMyProfileId();
  const { exchange } = useContext(Exchange_CardContext);

  return (
    <Link
      className="flex flex-1 flex-col items-center justify-center"
      href={`/@${id}/my/exchanges/${exchange.get("id")}/deals/${deal_id}`}
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
      <h3
        className="my-5 line-clamp-2 text-2xl font-bold"
        title={exchange.title}
      >
        {exchange.title}
      </h3>
      <div className="my-2  flex flex-row justify-between">
        <OnlineOrLocation
          is_online={exchange.is_online}
          location={exchange.location}
        />
        <time
          className="mt-3 text-xs"
          dateTime={exchange.updatedAt.toUTCString()}
          title={exchange.updatedAt.toUTCString()}
        >
          {exchange.updatedAt.toLocaleDateString("fr")}
        </time>
      </div>

      <div className="flex flex-row">
        <UI.ProposedByFigure
          avatar={
            <Link_Avatar className="h-12 w-12" u={exchange.profile.get("id")} />
          }
          label={"Proposé par :"}
        >
          {exchange.profile.name}
        </UI.ProposedByFigure>
      </div>

      <Formik
        initialValues={{ message: "" }}
        onSubmit={(value) => onSend(value.message)}
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
