"use client";

import { Spinner } from "@1.ui/react/spinner";
import { useTimeoutEffect, useToggle } from "@react-hookz/web";
import { m } from "framer-motion";
import { tv } from "tailwind-variants";
import { match } from "ts-pattern";

//

export default function Verifying_Flow() {
  const [email_sent, set_email_sent] = useToggle(false);

  useTimeoutEffect(() => {
    set_email_sent(true);
  }, 6_666);

  return (
    <m.div
      key={String(email_sent)}
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -10, opacity: 0 }}
      transition={{ duration: 0.66 }}
    >
      {match(email_sent)
        .with(false, () => <Verifying_SendingEmail />)
        .with(true, () => <Verifying_EmailSent />)
        .exhaustive()}
    </m.div>
  );
}

//

function Verifying_SendingEmail() {
  const { base, title } = classes();
  return (
    <main className={base()}>
      <h1 className={title()}>Vérification</h1>

      <p>Consultez votre boite mail pour confirmer votre identité.</p>

      <br />

      <Spinner />
    </main>
  );
}

function Verifying_EmailSent() {
  const { base, title } = classes();
  return (
    <main className={base()}>
      <h1 className={title()}>Vérification</h1>

      <p>
        Consultez votre boite mail pour confirmer votre identité.
        <br />
        Cela peut prendre quelques minutes.
      </p>

      <br />

      <br />
    </main>
  );
}

const classes = tv({
  base: "mx-auto text-center",
  slots: {
    title: `
    my-0
    text-6xl
    font-extrabold
    sm:text-7xl
    lg:text-8xl
  `,
  },
});
