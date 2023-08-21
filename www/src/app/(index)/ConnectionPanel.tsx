"use client";

import { Avatar } from "@/components/Avatar";
import { Spinner } from "@1/ui/components/Spinner";
import { LoginForm } from "@1/ui/domains/login/LoginForm";
import { useMutation } from "@tanstack/react-query";
import type { Session } from "next-auth";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useCallback,
  type ComponentProps,
  type PropsWithChildren,
} from "react";
import { match } from "ts-pattern";

//

export function ConnectionPanel() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { mutate, isLoading, isSuccess, isError } = useMutation(
    submitFormHandler,
    { retry: 3 },
  );
  const onLoginFormSubmit: ComponentProps<
    typeof LoginForm
  >["onLogin"] = async ({ email }) => await mutate({ email });
  const onSignUpFormSubmit: ComponentProps<
    typeof LoginForm
  >["onSignUp"] = async ({ email, as }) => {
    match(as as "student" | "partner")
      .with("student", () => router.push(`/signup/user?email=${email}`))
      .with("partner", () => console.info("TODO"));
  };

  if (status === "loading") return <Loading />;
  if (session && session.user && status === "authenticated")
    return <LoginAs user={session.user} />;

  if (isLoading) return <Loading />;
  if (isError) return <ErrorOccur />;
  if (isSuccess) return <CheckYourMail />;

  return (
    <LoginForm onLogin={onLoginFormSubmit} onSignUp={onSignUpFormSubmit} />
  );
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
  return (
    <WhiteCard>
      <center className="grid min-h-[200px] grid-cols-1 items-center ">
        <h1 className="text-4xl">❌</h1>
        Une erreur est survenu...
      </center>
    </WhiteCard>
  );
}

function CheckYourMail() {
  return (
    <WhiteCard>
      <center className="grid min-h-[200px] grid-cols-1 items-center ">
        <h1 className="text-4xl">✅</h1>
        Consulté votre boite mail pour confirmer votre identité
      </center>
    </WhiteCard>
  );
}

function LoginAs({ user }: { user: NonNullable<Session["user"]> }) {
  const on_logout = useCallback(() => signOut(), [user.email]);
  return (
    <WhiteCard>
      <Link href="/exchange">
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
}
