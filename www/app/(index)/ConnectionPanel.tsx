"use client";

import { Avatar } from ":components/Avatar";
import { Button } from "@1/ui/components/ButtonV";
import { Spinner } from "@1/ui/components/Spinner";
import { LoginForm } from "@1/ui/domains/login/LoginForm";
import { DomLazyMotion } from "@1/ui/helpers/DomLazyMotion";
import { useTimeoutEffect } from "@react-hookz/web";
import { useMutation } from "@tanstack/react-query";
import constate from "constate";
import { AnimatePresence, m } from "framer-motion";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useCallback,
  useState,
  type ComponentProps,
  type PropsWithChildren,
} from "react";
import Nest from "react-nest";
import { P, match } from "ts-pattern";

//

type Outlet_State =
  | { state: "connected as" }
  | { state: "error"; error: Error }
  | { state: "form" }
  | { state: "idle" }
  | { state: "loading" };

function useOutlet() {
  const [context, setContext] = useState<Outlet_State>({ state: "idle" });
  const immediate_next = useCallback(
    (next_context: Outlet_State) =>
      setTimeout(() => setContext(next_context), 0),
    // setContext((ctx) => ({ ...ctx, next_context })),
    [],
  );
  const next = useCallback(setContext, []);
  return { context, immediate_next, next };
}

const [
  Outlet_Provider,
  useOutlet_State,
  useOutlet_ImmediateNext,
  useOutlet_Next,
] = constate(
  useOutlet,
  ({ context }) => context.state,
  (value) => value.immediate_next,
  (value) => value.next,
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
    .with("connected as", () => <ConnectedAs />)
    .with("error", () => <ErrorOccur />)
    .with("form", () => <LoginFormPanel />)
    .with("idle", () => <LookForExistingSession />)
    .with("loading", () => <Loading />)
    .exhaustive();
}

function LookForExistingSession() {
  const session = useSession();
  const next = useOutlet_ImmediateNext();

  return match(session)
    .with({ status: "authenticated" }, () => {
      next({ state: "connected as" });
      return null;
    })
    .with({ status: "loading" }, () => <Loading />)
    .with({ status: "unauthenticated" }, () => {
      next({ state: "form" });
      return null;
    })
    .exhaustive();
}

function LoginFormPanel() {
  const next = useOutlet_ImmediateNext();
  const router = useRouter();

  const mutation_result = useMutation(submitFormHandler, { retry: 3 });

  const onLoginFormSubmit: ComponentProps<typeof LoginForm>["onLogin"] =
    useCallback(
      async ({ email }) => await mutation_result.mutate({ email }),
      [],
    );

  const onSignUpFormSubmit: ComponentProps<typeof LoginForm>["onSignUp"] =
    useCallback(async ({ email, as }) => {
      match(as as "student" | "partner")
        .with("student", () => router.push(`/signup/user?email=${email}`))
        .with("partner", () => router.push(`/signup/partener?email=${email}`));
    }, []);

  return match(mutation_result)
    .with({ status: "error", error: P.select() }, (error) => {
      next({ state: "error", error: error as Error });
      return null;
    })
    .with({ status: "idle" }, () => (
      <LoginForm onLogin={onLoginFormSubmit} onSignUp={onSignUpFormSubmit} />
    ))
    .with({ status: "loading" }, () => <Loading />)
    .with({ status: "success" }, () => <CheckYourMail />)
    .exhaustive();
}

async function submitFormHandler({ email }: { email: string }) {
  const res = await fetch(`/api/auth/magic/${email}`);
  const result = await res.json();
  if (result.error) {
    throw result.error;
  }
  return result;
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
  const next = useOutlet_Next();
  const on_back = useCallback(() => next({ state: "form" }), []);

  useTimeoutEffect(() => {
    next({ state: "form" });
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
  const next = useOutlet_Next();
  const on_back = useCallback(() => next({ state: "form" }), []);

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
  const next = useOutlet_ImmediateNext();

  try {
    const { data } = useSession();
    const user = data!.user!;

    const on_logout = useCallback(() => signOut(), [user.email, user.id]);

    const href = match(user.role)
      .with("studient", () => `/exchange`)
      .with("partner", () => `/opportunity`)
      .exhaustive();

    return (
      <WhiteCard>
        <Link href={href}>
          <figure>
            <Avatar className="m-auto aspect-square rounded-full p-11" />
            <figcaption className="text-center">
              <h3 className="text-center">
                Vous êtes connecté en tant que : <strong>{user.name}</strong>.
              </h3>
            </figcaption>
          </figure>
        </Link>

        <hr />

        <button onClick={on_logout}>Me déconnecter</button>
      </WhiteCard>
    );
  } catch (error) {
    next({ state: "error", error: error as Error });
    return null;
  }
}
