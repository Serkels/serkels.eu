"use client";

import { Button } from "@1.ui/react/button";
import { useRouter, useSearchParams } from "next/navigation";
import { match } from "ts-pattern";

export function ErrorMessage() {
  const search_params = useSearchParams();
  const router = useRouter();
  const error = search_params.get("error");

  return match(error)
    .with("Configuration", () => (
      <div className="space-y-3 text-center text-xs">
        <p>Il y a un problème avec le serveur.</p>
        <p>Veuillez réessayer plus tard.</p>
      </div>
    ))
    .with("AccessDenied", () => (
      <div className="space-y-3 text-center text-xs">
        <p>Vous n'avez pas accès à cette page.</p>
        <Button
          onPress={() => router.push("/")}
          variant={{ intent: "whity", size: "sm" }}
        >
          Retourner à l'accueil
        </Button>
      </div>
    ))
    .with("Verification", () => (
      <div className="space-y-3 text-center text-xs">
        <p>Le lien de vérification est invalide.</p>
        <p>Il a peut-être déjà été utilisé ou a expiré.</p>
        <Button
          onPress={() => router.push("/")}
          variant={{ intent: "whity", size: "sm" }}
        >
          Retourner à l'accueil
        </Button>
      </div>
    ))

    .otherwise(() => null);
}
