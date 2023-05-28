"use client";

//

import { LoginForm } from "@1/ui/shell/LoginForm";
import { useMutation } from "@tanstack/react-query";

import { useSession } from "next-auth/react";

//

export function ConnectionPanel() {
  const { data: session, status } = useSession();
  const { mutate, isLoading, isSuccess, isError } =
    useMutation(submitFormHandler);
  const onFormSubmit = async ({ email }: { email: string }) =>
    await mutate({ email });

  console.log({ session, status });
  if (isLoading) return <>Loading.</>;
  if (isSuccess) return <>Success.</>;
  if (isError) return <>Error.</>;
  return <LoginForm onSubmit={onFormSubmit} />;
  /*
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
          //onSubmit(email!);
        },
      }
    );
  };

  const { status } = mutation;

  return match(status)
    .with("idle", () => <LoginForm onSubmit={onFormSubmit} />)
    .with("loading", () => <>Loading.</>)
    .with("error", () => <>Error.</>)
    .with("success", () => <>Success.</>)
    .exhaustive();
    */
}

async function submitFormHandler({ email }: { email: string }) {
  const res = await fetch("http://localhost:1337/api/passwordless/send-link", {
    method: "POST",
    body: JSON.stringify({
      email,
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  });
  const result = await res.json();
  return result;
}
