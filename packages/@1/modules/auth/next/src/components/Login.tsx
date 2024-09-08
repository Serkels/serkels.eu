import { Button } from "@1.ui/react/button";
import type { FormHTMLAttributes } from "react";

//

export function Login(props: FormHTMLAttributes<HTMLFormElement>) {
  return (
    <form
      className="flex flex-col items-center space-y-5 text-black"
      {...props}
    >
      <input
        className="h-8 max-w-[90%] rounded-sm border border-solid border-[#dddddd] px-3 py-2 placeholder-[#AAAAAA] md:text-xs"
        name="email"
        placeholder="Adresse email de connexion"
        required
        type="email"
      />
      <input
        className="h-8 max-w-[90%] rounded-sm border border-solid border-[#dddddd] px-3 py-2 placeholder-[#AAAAAA] md:text-xs"
        name="password"
        placeholder="Mot de passe"
        required
        type="password"
      />
      <Button intent="primary" type="submit">
        Se connecter
      </Button>
    </form>
  );
}
