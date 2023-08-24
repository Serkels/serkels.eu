//

import { Button } from "@1/ui/components/ButtonV";
import { Spinner } from "@1/ui/components/Spinner";
import * as UI from "@1/ui/domains/exchange/AskModal";
import { OnlineOrLocation } from "@1/ui/domains/exchange/OnlineOrLocation";
import { Share } from "@1/ui/icons";
import { useMutation } from "@tanstack/react-query";
import { Formik } from "formik";
import { useContext } from "react";
import { useTimeoutFn } from "react-use";
import { match } from "ts-pattern";
import { Avatar } from "~/components/Avatar";
import { ErrorOccur } from "~/components/ErrorOccur";
import { Exchange_CardContext } from "./ExchangeCard.context";

//

export function Ask_Action() {
  return (
    <UI.DialogTrigger>
      <Button>Demender</Button>

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
  console.log({ exchange });
  const mutation_info = useMutation(
    (_message: string) =>
      new Promise((resolve) => setTimeout(resolve, 3_333 * Math.random())),
  );
  return match(mutation_info)
    .with({ status: "error" }, () => (
      <ErrorOccur error={mutation_info.error as Error} />
    ))
    .with({ status: "idle" }, () => <Ask_Form onSend={mutation_info.mutate} />)
    .with({ status: "loading" }, () => <Loading />)
    .with({ status: "success" }, () => <MessageSent />)
    .exhaustive();
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
        Envoie en cours...
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
