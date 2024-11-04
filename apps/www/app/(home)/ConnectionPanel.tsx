"use client";

import { DomLazyMotion } from ":components/shell/DomLazyMotion";
import { trpc_client } from "@1.infra/trpc/react-query/client";
import { signIn, signOut, useSession } from "@1.modules/auth.next/react";
import { AuthError, HTTPError } from "@1.modules/core/errors";
import { Avatar } from "@1.modules/profile.ui";
import { Button } from "@1.ui/react/button";
import { Spinner } from "@1.ui/react/spinner";
import { useTimeoutEffect } from "@react-hookz/web";
import { useMutation } from "@tanstack/react-query";
import constate from "constate";
import { AnimatePresence, m } from "framer-motion";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  useCallback,
  useEffect,
  useState,
  type ComponentProps,
  type PropsWithChildren,
} from "react";
import ContentLoader from "react-content-loader";
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
  const search_params = useSearchParams();
  const error = search_params.get("error");
  const [context, setContext] = useState<Outlet_State>(
    typeof error === "string" && error.length > 0
      ? { state: "error", error: new AuthError(error) }
      : { state: "idle" },
  );
  // const [context, setContext] = useMatrixHash<Outlet_State>({ state: "idle" });
  return { context, set_context: setContext };
}

const [Outlet_Provider, useOutlet_Error, useOutlet_Send, useOutlet_State] =
  constate(
    useOutlet,
    ({ context }) => {
      if (context.state !== "error") return new Error("Invalid state");
      return context.error;
    },
    (value) => value.set_context,
    ({ context }) => context.state,
  );

//

export default function ConnectionPanel() {
  return (
    <Outlet_Provider>
      <DomLazyMotion>
        <AnimatePresence mode="wait">
          <ConnectionPanel_MotionOutlet />
        </AnimatePresence>
      </DomLazyMotion>
    </Outlet_Provider>
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

  const signin_mutation_info = useSignIn_Mutation();
  const verify_mutation_info = trpc_client.auth.verify.useMutation();

  const on_login_form_submit: ComponentProps<typeof LoginForm>["onLogin"] =
    useCallback(async ({ email }) => {
      const user = await verify_mutation_info.mutateAsync({ email });
      if (!user) {
        return send({
          state: "error",
          error: new Error(
            "Aucun utilisateur trouvé. Veuillez d'abord vous inscrire",
          ),
        });
      }
      await signin_mutation_info.mutate(email);
    }, []);

  const on_sign_up_form_submit: ComponentProps<typeof LoginForm>["onSignUp"] =
    useCallback(async ({ email }) => {
      const user = await verify_mutation_info.mutateAsync({ email });
      if (user) {
        return send({
          state: "error",
          error: new Error("Vous êtes déjà inscrit, veuillez vous connecter"),
        });
      }
      await signin_mutation_info.mutate(email);
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
  const { data: session } = useSession();
  const router = useRouter();

  const profile = session?.profile;

  useEffect(() => {
    if (profile) return;
    router.replace("/signup/student");
  }, [profile?.id]);

  const on_logout = useCallback(() => signOut(), [profile?.id]);

  const href = match(profile?.role)
    .with("STUDENT", () => `/exchanges`)
    .with("PARTNER", () => `/opportunities`)
    .with("ADMIN", () => `/`)
    .with(undefined, () => "/")
    .exhaustive();

  if (!profile)
    return (
      <ContentLoader
        speed={2}
        viewBox="0 0 50 50"
        gradientRatio={1}
        backgroundOpacity={0.1}
        backgroundColor="black"
        foregroundColor="transparent"
        foregroundOpacity={0}
      >
        <rect x="0" y="0" rx="3" ry="3" width="50" height="50 " />
      </ContentLoader>
    );
  return (
    <WhiteCard>
      <Link href={href}>
        <figure className="space-y-6">
          <Avatar className="mx-auto block w-[50%]" profile={profile} />
          <figcaption className="text-center">
            <h3 className="text-center">
              Vous êtes connecté en tant que : <strong>{profile.name}</strong>.
            </h3>
          </figcaption>
        </figure>
      </Link>

      <hr />

      <button onClick={on_logout}>Me déconnecter</button>
    </WhiteCard>
  );
}

function useSignIn_Mutation() {
  return useMutation({
    mutationFn: async (email: string) => {
      const response = await signIn("nodemailer", {
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
