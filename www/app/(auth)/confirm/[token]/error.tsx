"use client"; // Error components must be Client Components

import { Button } from "@1/ui/components/ButtonV";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

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
        <br />
        <br />
        <Button intent="danger" onPress={reset}>
          Réessayer
        </Button>
      </p>
    </>
  );
}
