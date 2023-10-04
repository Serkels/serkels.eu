"use client";

import { Avatar } from ":components/Avatar";
import { trpc } from ":trpc/client";
import { Button } from "@1/ui/components/ButtonV";
import { Spinner } from "@1/ui/components/Spinner";
import { LoginForm } from "@1/ui/domains/login/LoginForm";
import { DomLazyMotion } from "@1/ui/helpers/DomLazyMotion";
import { useTimeoutEffect } from "@react-hookz/web";
import constate from "constate";
import { AnimatePresence, m } from "framer-motion";
import { signOut, useSession } from "next-auth/react";
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
  return { context, set_context: setContext };
}

const [Outlet_Provider, useOutlet_State, useOutlet_Next] = constate(
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
  const next = useOutlet_Next();

  useEffect(() => {
    return match(session)
      .with({ status: "authenticated" }, () => {
        next({ state: "connected as" });
      })
      .with({ status: "loading" }, () => {})
      .with({ status: "unauthenticated" }, () => {
        next({ state: "form" });
      })
      .exhaustive();
  }, [session]);

  return match(session)
    .with({ status: "loading" }, () => <Loading />)
    .with({ status: P._ }, () => null)
    .exhaustive();
}

function LoginFormPanel() {
  const next = useOutlet_Next();
  const router = useRouter();

  const mutation_info = trpc.passwordless.send_magic_link.useMutation();

  const on_login_form_submit: ComponentProps<typeof LoginForm>["onLogin"] =
    useCallback(async ({ email }) => await mutation_info.mutate({ email }), []);

  const on_sign_up_form_submit: ComponentProps<typeof LoginForm>["onSignUp"] =
    useCallback(async ({ email, as }) => {
      match(as as "student" | "partner")
        .with("student", () => router.push(`/signup/user?email=${email}`))
        .with("partner", () => router.push(`/signup/partener?email=${email}`));
    }, []);

  useEffect(() => {
    return match(mutation_info)
      .with({ status: "error", error: P.select() }, (error) => {
        next({ state: "error", error: error as any });
      })
      .with({ status: "idle" }, () => {})
      .with({ status: "loading" }, () => {})
      .with({ status: "success" }, () => {
        next({ state: "check your mail" });
      })
      .exhaustive();
  }, [mutation_info.status]);

  return match(mutation_info)
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
  const next = useOutlet_Next();

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
            <Avatar className="m-auto aspect-square min-h-[60px] rounded-full p-11" />
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
    setTimeout(() => next({ state: "error", error: error as Error }), 0);
    return null;
  }
}
