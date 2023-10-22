"use client";

import { Avatar } from ":components/avatar";
import { DomLazyMotion } from ":components/shell/DomLazyMotion";
import { HTTPError } from "@1.modules/core/errors";
import { PROFILE_ROLES, type Profile } from "@1.modules/profile.domain";
import { Button } from "@1.ui/react/button";
import { Spinner } from "@1.ui/react/spinner";
import { useTimeoutEffect } from "@react-hookz/web";
import { useMutation } from "@tanstack/react-query";
import constate from "constate";
import { AnimatePresence, m } from "framer-motion";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useState,
  type ComponentProps,
  type PropsWithChildren,
} from "react";
import Nest from "react-nest";
import { P, match } from "ts-pattern";
import { LoginForm } from "./LoginForm";

//

type Outlet_State =
  | { state: "check your mail" }
  | { state: "connected as" }
  | { state: "error"; error: Error }
  | { state: "form" }
  | { state: "idle" }
  | { state: "loading" };

function useOutlet() {
  const [context, setContext] = useState<Outlet_State>({ state: "idle" });
  // const [context, setContext] = useMatrixHash<Outlet_State>({ state: "idle" });
  return { context, set_context: setContext };
}

const [Outlet_Provider, useOutlet_State, useOutlet_Send] = constate(
  useOutlet,
  ({ context }) => context.state,

  (value) => value.set_context,
);

//

export default function ConnectionPanel() {
  return (
    <Nest>
      <Outlet_Provider />
      <DomLazyMotion />
      <AnimatePresence mode="wait" />
      <ConnectionPanel_MotionOutlet />
    </Nest>
  );
}

function ConnectionPanel_MotionOutlet() {
  const state = useOutlet_State();

  return (
    <m.div
      key={state}
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -10, opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <ConnectionPanel_Outlet />
    </m.div>
  );
}

function ConnectionPanel_Outlet() {
  const state = useOutlet_State();

  return match(state)
    .with("check your mail", () => <CheckYourMail />)
    .with("connected as", () => <ConnectedAs />)
    .with("error", () => <ErrorOccur />)
    .with("form", () => <LoginFormPanel />)
    .with("idle", () => <LookForExistingSession />)
    .with("loading", () => <Loading />)
    .exhaustive();
}

//

function LookForExistingSession() {
  const session = useSession();
  const send = useOutlet_Send();

  useEffect(() => {
    return match(session)
      .with({ status: "authenticated" }, () => {
        send({ state: "connected as" });
      })
      .with({ status: "loading" }, () => {})
      .with({ status: "unauthenticated" }, () => {
        send({ state: "form" });
      })
      .exhaustive();
  }, [session]);

  return match(session)
    .with({ status: "loading" }, () => <Loading />)
    .with({ status: P._ }, () => null)
    .exhaustive();
}

function LoginFormPanel() {
  const send = useOutlet_Send();
  const router = useRouter();

  const signin_mutation_info = useSignIn_Mutation();

  const on_login_form_submit: ComponentProps<typeof LoginForm>["onLogin"] =
    useCallback(
      async ({ email }) => await signin_mutation_info.mutate(email),
      [],
    );

  const on_sign_up_form_submit: ComponentProps<typeof LoginForm>["onSignUp"] =
    useCallback(async ({ email, as }) => {
      match(as as PROFILE_ROLES)
        .with(PROFILE_ROLES.enum.STUDIENT, () =>
          router.push(`/signup/studient?email=${email}`),
        )
        .with(PROFILE_ROLES.enum.PARTNER, () =>
          router.push(`/signup/partner?email=${email}`),
        );
    }, []);

  useEffect(() => {
    return match(signin_mutation_info)
      .with({ status: "error", error: P.select() }, (error) => {
        send({ state: "error", error: error as any });
      })
      .with({ status: "idle" }, () => {})
      .with({ status: "loading" }, () => {})
      .with({ status: "success" }, () => {
        send({ state: "check your mail" });
      })
      .exhaustive();
  }, [signin_mutation_info.status]);

  return match(signin_mutation_info)
    .with({ status: "error" }, () => null)
    .with({ status: "idle" }, () => (
      <LoginForm
        onLogin={on_login_form_submit}
        onSignUp={on_sign_up_form_submit}
      />
    ))
    .with({ status: "loading" }, () => <Loading />)
    .with({ status: "success" }, () => null)
    .exhaustive();
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
    <article
      className="grid grid-cols-1 gap-5 rounded-md border bg-white p-6 text-black
    shadow-[10px_10px_10px_#00000029]"
    >
      {children}
    </article>
  );
}

function ErrorOccur() {
  const send = useOutlet_Send();
  const on_back = useCallback(() => send({ state: "form" }), []);

  useTimeoutEffect(() => {
    send({ state: "form" });
  }, 6_666);

  return (
    <WhiteCard>
      <center className="grid min-h-[200px] grid-cols-1 items-center ">
        <h1 className="text-4xl">❌</h1>
        Une erreur est survenu...
      </center>

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
      <center className="grid min-h-[200px] grid-cols-1 items-center ">
        <h1 className="text-4xl">✅</h1>
        Consulté votre boite mail pour confirmer votre identité
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

  try {
    const { data: session } = useSession();

    const profile =
      session?.profile ?? ({ role: PROFILE_ROLES.Enum.STUDIENT } as Profile);

    const on_logout = useCallback(() => signOut(), [profile.id]);

    const href = match(profile.role)
      .with("STUDIENT", () => `/exchanges`)
      .with("PARTNER", () => `/opportunities`)
      .with("ADMIN", () => `/`)
      .exhaustive();

    return (
      <WhiteCard>
        <Link href={href}>
          <figure>
            <Avatar className="m-auto aspect-square min-h-[60px] rounded-full p-11" />
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
  return useMutation({
    mutationFn: async (email: string) => {
      const response = await signIn("email", {
        email,
        redirect: false,
      });

      if (!response) throw new HTTPError("Missing response");
      if (response.error) throw new HTTPError(response.error);

      return response;
    },
    mutationKey: ["next_auth", "sign_in"] as const,
  });
}
