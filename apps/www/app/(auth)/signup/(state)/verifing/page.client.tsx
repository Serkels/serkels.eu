"use client";

import { Spinner } from "@1.ui/react/spinner";
import { useTimeoutEffect, useToggle } from "@react-hookz/web";
import { match } from "ts-pattern";

//

export default function Verifying_Flow({ token }: { token: string }) {
  token; // TODO(douglasduteil): use the token or pair to stream the connection process
  const [email_sent, set_email_sent] = useToggle(false);
  useTimeoutEffect(() => {
    set_email_sent(true);
  }, 6_666);
  return (
    <div>
      <p>Consulté votre boite mail pour confirmer votre identité.</p>

      <br />

      {match(email_sent)
        .with(true, () => null)
        .with(false, () => <Spinner />)
        .exhaustive()}
    </div>
  );
}
