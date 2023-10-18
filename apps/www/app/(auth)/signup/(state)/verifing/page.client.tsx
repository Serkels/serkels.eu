"use client";

import { Spinner } from "@1.ui/react/spinner";
import { useTimeoutEffect, useToggle } from "@react-hookz/web";
import { motion } from "framer-motion";
import { match } from "ts-pattern";

//

export default function Verifying_Flow() {
  const [email_sent, set_email_sent] = useToggle(false);
  useTimeoutEffect(() => {
    set_email_sent(true);
  }, 6_666);
  return (
    <motion.div
      key={String(email_sent)}
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -10, opacity: 0 }}
      transition={{ duration: 0.66 }}
    >
      {match(email_sent)
        .with(true, () => <Verifying__ />)
        .with(false, () => <Verifying_ />)
        .exhaustive()}
    </motion.div>
  );
}

function Verifying_() {
  return (
    <main className="mx-auto text-center ">
      <h1
        className={`
        my-0
        text-6xl
        font-extrabold
        sm:text-7xl
        lg:text-8xl
      `}
      >
        Vérification
      </h1>
      <p>Consulté votre boite mail pour confirmer votre identité.</p>

      <br />

      <Spinner />
    </main>
  );
}

function Verifying__() {
  return (
    <main className="mx-auto text-center" data-foo>
      <h1
        className={`
        my-0
        text-6xl
        font-extrabold
        sm:text-7xl
        lg:text-8xl
      `}
      >
        Vérification
      </h1>
      <p>Consulté votre boite mail pour confirmer votre identité.</p>

      <br />

      <br />
    </main>
  );
}
