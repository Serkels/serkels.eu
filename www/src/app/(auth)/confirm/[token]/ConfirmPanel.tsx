"use client";

import { Spinner } from "@1/ui/components/Spinner";
import { Banner } from "@1/ui/shell";
import { useMutation } from "@tanstack/react-query";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useCallback } from "react";

//

export function ConfirmPanel({ token }: { token: string }) {
  return (
    <Banner className="h-full bg-black text-white">
      <main className="container mx-auto max-w-5xl flex-1">
        <ConfirmPanelFlow token={token} />
      </main>
    </Banner>
  );
}

//

function ConfirmPanelFlow({ token }: { token: string }) {
  const { mutate, isLoading, isSuccess, isError, error } = useMutation(
    async () => {
      const res = await signIn("credentials", {
        token,
        callbackUrl: "/exchange",
        redirect: false,
      });

      if (!res) throw new Error();
      if (res.error) throw new Error(res.error);
    },
  );

  if (isLoading) return <Verifying />;
  if (isSuccess) return <ConnectionSuccess />;
  if (isError) {
    return <ErrorOccur error={error as Error} />;
  }
  return <VerificationInstruction onSubmit={mutate} />;
}

function VerificationInstruction({ onSubmit }: { onSubmit: () => void }) {
  const on_verify = useCallback(async () => {
    onSubmit();
  }, [onSubmit]);
  return (
    <>
      <p className="mx-auto max-w-xl text-center text-xl">
        Pour terminer le processus de vérification, veuillez cliquer sur le
        bouton ci-dessous :
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

function ErrorOccur({ error }: { error: Error }) {
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
