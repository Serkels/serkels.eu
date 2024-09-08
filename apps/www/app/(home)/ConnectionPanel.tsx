"use client";

import { DomLazyMotion } from ":components/shell/DomLazyMotion";
import { Login } from "@1.modules/auth.next/components/Login";
import { AuthError, HTTPError } from "@1.modules/core/errors";
import { PROFILE_UNKNOWN } from "@1.modules/profile.domain";
import { Avatar } from "@1.modules/profile.ui";
import { Button } from "@1.ui/react/button";
import { button } from "@1.ui/react/button/atom";
import { Spinner } from "@1.ui/react/spinner";
import { useAsync, useMountEffect, useTimeoutEffect } from "@react-hookz/web";
import { useMutation } from "@tanstack/react-query";
import constate from "constate";
import { createHost, createSlot } from "create-slots";
import { AnimatePresence, m } from "framer-motion";
import type { Session } from "next-auth";
import { getSession, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  useCallback,
  useEffect,
  useState,
  type FormEventHandler,
  type PropsWithChildren,
} from "react";
import { P, match } from "ts-pattern";
import { useServerAction } from "zsa-react";
import { login_action } from "./actions";

//

type Outlet_State =
  | { state: "check your mail" }
  | { state: "connected as"; session: Session }
  | { state: "error"; error: Error }
  | { state: "form" }
  | { state: "idle" }
  | { state: "loading" };

function useOutlet() {
  const search_params = useSearchParams();
  const error = search_params.get("error");
  const [context, setContext] = useState<Outlet_State>(
    typeof error === "string" && error.length > 0
      ? { state: "error", error: new AuthError(error) }
      : { state: "idle" },
  );

  return { context, set_context: setContext };
}

const [
  Outlet_Provider,
  useOutlet_Error,
  useOutlet_Send,
  useOutlet_State,
  useOutlet_Session,
] = constate(
  useOutlet,
  ({ context }) => {
    if (context.state !== "error") return new Error("Invalid state");
    return context.error;
  },
  (value) => value.set_context,
  ({ context }) => context.state,
  ({ context }) => {
    if (context.state !== "connected as") return null;
    return context.session;
  },
);

//

export default function ConnectionPanel({ children }: PropsWithChildren) {
  return (
    <Outlet_Provider>
      <DomLazyMotion>
        <AnimatePresence mode="wait">
          <ConnectionPanel_MotionOutlet>
            {children}
          </ConnectionPanel_MotionOutlet>
        </AnimatePresence>
      </DomLazyMotion>
    </Outlet_Provider>
  );
}

function ConnectionPanel_MotionOutlet({ children }: PropsWithChildren) {
  const state = useOutlet_State();

  return (
    <m.div
      key={state}
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -10, opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </m.div>
  );
}

export const ConnectionPanel_Idle = createSlot("div");
export function ConnectionPanel_Outlet({ children }: PropsWithChildren) {
  const state = useOutlet_State();
  return createHost(children, () => {
    return match(state)
      .with("check your mail", () => <CheckYourMail />)
      .with("connected as", () => <ConnectedAs />)
      .with("error", () => <ErrorOccur />)
      .with("form", () => <LoginFormPanel />)
      .with("idle", () => <LookForExistingSession />)
      .with("loading", () => <Loading />)
      .exhaustive();
  });
}

//

export function LookForExistingSession() {
  const session = useSession();
  const send = useOutlet_Send();

  const [state, { execute }] = useAsync(getSession);
  useEffect(() => {
    if (state.status !== "success") return;
    if (!state.result) {
      send({ state: "form" });
    } else {
      send({ state: "connected as", session: state.result });
    }
  }, [session.status, state.status, execute]);

  useMountEffect(execute);

  return <Loading />;
}

function LoginFormPanel() {
  const send = useOutlet_Send();

  const signin_mutation_info = useSignIn_Mutation();

  const on_login_form_submit: FormEventHandler<HTMLFormElement> = useCallback(
    async (event) => {
      event.preventDefault();
      const form = event.currentTarget;

      const formData = new FormData(form);
      await signin_mutation_info.mutate(formData);
    },
    [],
  );

  // const on_sign_up_form_submit=
  //   useCallback(async ({ email, as }) => {
  //     match(as as PROFILE_ROLES)
  //       .with(PROFILE_ROLES.enum.STUDENT, () =>
  //         router.push(`/signup/student?email=${email}`),
  //       )
  //       .with(PROFILE_ROLES.enum.PARTNER, () =>
  //         router.push(`/signup/partner?email=${email}`),
  //       );
  //   }, []);

  useEffect(() => {
    return match(signin_mutation_info)
      .with({ status: "error", error: P.select() }, (error) => {
        send({ state: "error", error: error as any });
      })
      .with({ status: "idle" }, () => {})
      .with({ status: "loading" }, () => {})
      .with({ status: "success" }, () => {
        send({ state: "idle" });
      })
      .exhaustive();
  }, [signin_mutation_info.status]);

  return match(signin_mutation_info)
    .with({ status: "error" }, () => null)
    .with({ status: "idle" }, () => (
      <Card>
        <Login onSubmit={on_login_form_submit} />
        <hr />
        <Link
          className={button({ intent: "secondary" })}
          href="/signup/student"
        >
          Créer un compte
        </Link>
      </Card>
    ))
    .with({ status: "loading" }, () => <Loading />)
    .with({ status: "success" }, () => null)
    .exhaustive();
}
function Card({ children }: PropsWithChildren) {
  return (
    <div className="flex flex-col items-center space-y-5 rounded-md border bg-white px-4 py-5 text-Dove_Gray shadow-[10px_10px_10px_#00000029]">
      {children}
    </div>
  );
}
function Loading() {
  return (
    <section className="text-center">
      <Spinner />
    </section>
  );
}

function WhiteCard({ children }: PropsWithChildren) {
  return (
    <article className="flex min-h-[200px] flex-col space-y-5 rounded-md border bg-white p-6 text-black shadow-[10px_10px_10px_#00000029]">
      {children}
    </article>
  );
}

function ErrorOccur() {
  const send = useOutlet_Send();
  const error = useOutlet_Error();
  const on_back = useCallback(() => send({ state: "form" }), []);

  useTimeoutEffect(() => {
    send({ state: "form" });
  }, 6_666);

  return (
    <WhiteCard>
      <center className="grid min-h-[200px] grid-cols-1 items-center">
        <h1 className="text-4xl">❌</h1>
        Une erreur est survenue...
      </center>

      <hr />

      <p className="relative w-full break-words font-mono">{error.message}</p>

      <hr />

      <Button intent="light" onPress={on_back}>
        Retour
      </Button>
    </WhiteCard>
  );
}

function CheckYourMail() {
  const send = useOutlet_Send();
  const on_back = useCallback(() => send({ state: "form" }), []);

  return (
    <WhiteCard>
      <center className="grid min-h-[200px] grid-cols-1 items-center">
        <h1 className="text-4xl">✅</h1>
        Consultez votre boite mail pour confirmer votre identité
      </center>

      <hr />

      <Button intent="light" onPress={on_back}>
        Retour
      </Button>
    </WhiteCard>
  );
}

function ConnectedAs() {
  const send = useOutlet_Send();
  const session = useOutlet_Session();
  const profile = session?.profile ?? PROFILE_UNKNOWN;
  const on_logout = useCallback(
    () => signOut({ callbackUrl: "/logout" }),
    [profile.id],
  );

  try {
    const href = match(profile.role)
      .with("STUDENT", () => `/exchanges`)
      .with("PARTNER", () => `/opportunities`)
      .with("ADMIN", () => `/`)
      .exhaustive();

    return (
      <WhiteCard>
        <Link href={href}>
          <figure className="space-y-6">
            <Avatar className="mx-auto block w-[50%]" profile={profile} />
            <figcaption className="text-center">
              <h3 className="text-center">
                Vous êtes connecté en tant que : <strong>{profile.name}</strong>
                .
              </h3>
            </figcaption>
          </figure>
        </Link>

        <hr />

        <button onClick={on_logout}>Me déconnecter</button>
      </WhiteCard>
    );
  } catch (error) {
    console.error(error);
    setTimeout(() => signOut({ redirect: false }), 0);
    setTimeout(() => send({ state: "error", error: error as Error }), 0);
    return null;
  }
}

function useSignIn_Mutation() {
  const { execute } = useServerAction(login_action);

  return useMutation({
    mutationFn: async (data: FormData) => {
      const [response] = await execute(data);
      if (!response) throw new HTTPError("Missing response");
      return response;
    },
    mutationKey: ["next_auth", "sign_in"] as const,
  });
}
