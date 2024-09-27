//

import { Button } from "@1.ui/react/button";
import { input } from "@1.ui/react/form/atom";
import type { FormEventHandler } from "react";
import { tv } from "tailwind-variants";

//

type Props = {
  onLogin: FormEventHandler<HTMLFormElement>;
  onSignup: () => void;
};
export function LoginOrSubmit({ onLogin, onSignup }: Props) {
  const { base, form, line, line_text, button } = layout();
  return (
    <div className={base()}>
      <form className={form()} onSubmit={onLogin}>
        <input
          className={input({ className: "col-span-full" })}
          name="email"
          placeholder="Adresse email de connexion"
          required
          type="email"
        />
        <Button
          className={button()}
          type="submit"
          variant={{
            size: "lg",
          }}
        >
          Se connecter
        </Button>
      </form>

      <div className="inline-flex items-center justify-center w-full relative">
        <hr className={line()} />
        <span className={line_text()}>Ou</span>
      </div>

      <Button
        className={button()}
        onPress={onSignup}
        type="submit"
        variant={{
          size: "lg",
          intent: "secondary",
        }}
      >
        Créer un compte
      </Button>
    </div>
  );
}

const layout = tv({
  base: `
    rounded-xl
    border
    px-4
    py-6
    bg-white
    text-black
    shadow-[10px_10px_10px_#00000029]
  `,
  slots: {
    button: "!block max-w-[95%] min-w-fit mx-auto",
    form: "flex flex-col items-center space-y-5",
    input: "h-8 w-full",
    line: `
      w-full
      h-[1px]
      bg-[#BEBEBE]
      border-0
      rounded
      my-10
    `,
    line_text: `
      absolute
      px-3
      font-medium
      text-[#AAAAAA]
      -translate-x-1/2
      bg-white
      left-1/2
    `,
  },
});
