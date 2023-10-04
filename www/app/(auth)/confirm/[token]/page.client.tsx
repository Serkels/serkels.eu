"use client";

import { HTTPError } from "@1/core_";
import { Spinner } from "@1/ui/components/Spinner";
import { DomLazyMotion } from "@1/ui/helpers/DomLazyMotion";
import { useQuery } from "@tanstack/react-query";
import constate from "constate";
import { AnimatePresence, m } from "framer-motion";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import Nest from "react-nest";
import { P, match } from "ts-pattern";

//

type Outlet_State =
  | { state: "authorized" }
  | { state: "error"; error: Error }
  | { state: "idle"; token: string }
  | { state: "verifing"; token: string };

function useOutlet({ token }: { token: string }) {
  const [context, setContext] = useState<Outlet_State>({
    state: "idle",
    token,
  });
  return { context, next: setContext };
}

const [Outlet_Provider, useController, use_ctrl_context] = constate(
  useOutlet,
  (ctrl) => ctrl,
  ({ context }) => context,
);

{
  /* .filter(<T>(x: T): x is NonNullable<T> => x != null) */
}
//
export function ConfirmPanel({ token }: { token: string }) {
  return (
    <Nest>
      <Outlet_Provider token={token} />
      <DomLazyMotion />
      <AnimatePresence mode="wait" />
      <MotionOutlet />
    </Nest>
  );
}

function MotionOutlet() {
  const { state } = use_ctrl_context();

  return (
    <m.div
      key={state}
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -10, opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <ConfirmPanelFlow />
    </m.div>
  );
}
//

function ConfirmPanelFlow() {
  return match(use_ctrl_context())
    .with({ state: "authorized" }, () => <ConnectionSuccess />)
    .with({ state: "error" }, () => <ErrorOccur />)
    .with({ state: "idle" }, () => <VerificationInstruction />)
    .with({ state: "verifing" }, () => <Verifying_Flow />)
    .exhaustive();
}

//
/*
function __ConfirmPanelFlow({ token }: { token: string }) {
  const router = useRouter();
  const { data: session } = useSession();

  const sign_in_query = useMutation(
    async () => {
      const res = await signIn("credentials", {
        token,
        redirect: false,
      });

      if (!res) throw new Error();
      if (res.error) throw new Error(res.error);

      return;
    },
    {
      onSuccess() {},
    },
  );

  const id = session?.user?.profile.id;
  useEffect(() => {
    if (!id) return;

    setTimeout(() => {
      router.push(`/@${id}`);
    }, 3_333);
  }, [id]);

  return match(sign_in_query)
    .with({ status: "error", error: P.select() }, (error) => (
      <ErrorOccur error={error as Error} />
    ))
    .with({ status: "verifing" }, () => <Verifying_Flow />)
    .with({ status: "success" }, () => <ConnectionSuccess />)
    .otherwise(() => {
      return <VerificationInstruction onSubmit={sign_in_query.mutate} />;
    });
}
*/
function VerificationInstruction() {
  const { next, context } = useController();

  // TODO(douglasduteil): the return time should infer this
  if (context.state !== "idle") return null;

  const on_verify = useCallback(
    () => next({ state: "verifing", token: context.token }),
    [],
  );

  return (
    <>
      <p className="mx-auto max-w-xl text-center text-xl">
        Pour terminer le processus de vérification, veuillez cliquer sur le
        bouton ci-dessous :
      </p>
      <button
        className="mx-auto my-6 block rounded-sm bg-white p-3 font-bold text-black"
        onClick={on_verify}
      >
        Confirm
      </button>
    </>
  );
}

function useSignIn_Query(token: string) {
  return useQuery({
    queryFn: async () => {
      const response = await signIn("credentials", {
        token,
        redirect: false,
      });

      if (!response) throw new HTTPError("Missing response");
      if (response.error) throw new HTTPError(response.error);

      return response.url;
    },
    queryKey: ["next_auth", "sign_in", token] as const,
  });
}

function Verifying_Flow() {
  const { next, context } = useController();

  // TODO(douglasduteil): the return time should infer this
  if (context.state !== "verifing") return null;

  const query_info = useSignIn_Query(context.token);

  useEffect(() => {
    return match(query_info)
      .with({ status: "error", error: P.select() }, (error) => {
        next({ state: "error", error: error as any });
      })
      .with({ status: "success" }, () => {
        next({ state: "authorized" });
      })
      .otherwise(() => {});
  }, [query_info.status]);

  return match(query_info)
    .with({ status: "loading" }, () => <Verifying />)
    .otherwise(() => null);
}

function Verifying() {
  return (
    <>
      <h1
        className={`
          mx-auto
          my-0
          text-center text-6xl
          font-extrabold
          sm:text-7xl
          lg:text-8xl
        `}
      >
        Vérification
      </h1>
      <div className="mx-auto mt-5 text-center">
        <Spinner />
      </div>
    </>
  );
}

function ErrorOccur() {
  const { context } = useController();

  // TODO(douglasduteil): the return time should infer this
  if (context.state !== "error") return null;

  const { error } = context;

  if (error.message === "Profile not found") {
    window.location.href = "/signup";
    return null;
  }

  return (
    <>
      <h1
        className={`
          mx-auto
          my-0
          text-center text-6xl
          font-extrabold
          text-red-100
          sm:text-7xl
          lg:text-8xl

        `}
      >
        Authentification échouée
      </h1>
      <p className="mx-auto mt-5 max-w-xl text-center">
        Il semble que vous ayez cliqué sur un lien de vérification d'adresse
        e-mail non valide. Veuillez fermer cette fenêtre et réessayez de vous
        authentifier.
        <br />
        <code>{error.message}</code>
      </p>
    </>
  );
}

function ConnectionSuccess() {
  return (
    <>
      <h1
        className={`
          mx-auto
          my-0
          text-center text-6xl
          font-extrabold
          text-green-100
          sm:text-7xl
          lg:text-8xl
        `}
      >
        Connexion par e-mail réussie 🪄
      </h1>
      <p className="mx-auto mt-5 max-w-xl text-center">
        Votre adresse e-mail a été authentifiée avec succès. Vous allez être
        rediriger vers <Link href="/exchange">les échanges</Link>.
      </p>
    </>
  );
}
