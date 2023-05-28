"use client";

//

import { LoginForm } from "@1/ui/shell/LoginForm";

//

export function ConnectionPanel() {
  const onFormSubmit = () => {};
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
