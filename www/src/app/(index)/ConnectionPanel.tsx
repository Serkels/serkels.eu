"use client";

//

import { Spinner } from "@1/ui/components/Spinner";
import { LoginForm } from "@1/ui/domains/login/LoginForm";
import { useMutation } from "@tanstack/react-query";
import type { Session } from "next-auth";

import { signOut, useSession } from "next-auth/react";
import { useCallback, type PropsWithChildren } from "react";

//

export function ConnectionPanel() {
  const { data: session, status } = useSession();
  const { mutate, isLoading, isSuccess, isError } = useMutation(
    submitFormHandler,
    { retry: 3 }
  );
  const onFormSubmit = async ({ email }: { email: string }) =>
    await mutate({ email });

  if (status === "loading") return <Loading />;
  if (session && session.user && status === "authenticated")
    return <LoginAs user={session.user} />;
  console.log({ session, status });
  if (isLoading) return <Loading />;
  if (isError) return <ErrorOccur />;
  if (isSuccess) return <CheckYourMail />;
  return <LoginForm onSubmit={onFormSubmit} />;
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
    <article className="grid grid-cols-1 gap-5 rounded-md border bg-white p-6 text-black ">
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
      <figure>
        <img
          className="m-auto aspect-square rounded-full p-11"
          src={user.image!}
        />
        <figcaption className="text-center">
          <h3 className="text-center">
            Vous êtes connecté en tant que : <strong>{user.name}</strong>.
          </h3>
        </figcaption>
      </figure>

      <hr />

      <button onClick={on_logout}>Me déconnecter</button>
    </WhiteCard>
  );
}
