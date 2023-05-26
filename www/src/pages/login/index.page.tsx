//

import { client } from "@/api/client";
import { EmailVerification, LoginForm } from "@1/ui/login";
import { useMutation } from "@tanstack/react-query";
import { useCallback, useState, type ComponentProps } from "react";
import { match } from "ts-pattern";

//

export function Page() {
  const [sstate, changeState] = useState(
    "enter email" as "enter email" | "email verification"
  );
  const [email, setEmail] = useState("");
  const onUndo = useCallback(() => changeState("enter email"), []);
  const onSubmit = useCallback((email: string) => {
    setEmail(email);
    changeState("email verification");
  }, []);

  return match(sstate)
    .with("enter email", () => <Login onSubmit={onSubmit} />)
    .with("email verification", () => (
      <EmailVerification email={email} onUndo={onUndo} />
    ));
}

//

function Login({ onSubmit }: { onSubmit: (email: string) => void }) {
  const mutation = useMutation({
    mutationFn: async (body: object) => {
      const { data, error } = await client.post("/passwordless/send-link", {
        body,
      });

      if (error) throw error;

      return data;
    },
  });
  const onFormSubmit: ComponentProps<typeof LoginForm>["onSubmit"] = ({
    email,
  }) => {
    mutation.mutate(
      { email },
      {
        onSuccess({ email }) {
          onSubmit(email!);
        },
      }
    );
  };
  return (
    <>
      <h1>Log in to Toc Toc</h1>

      <LoginForm onSubmit={onFormSubmit} />
    </>
  );
}
