"use client";

import { Form } from "@1/ui/domains/exchange/AskModal";
import { Field, Formik, type FieldAttributes } from "formik";
import { useSession } from "next-auth/react";
import tw from "tailwind-styled-components";
import { fromClient } from "~/app/api/v1";
import { Deal_Message_Controller } from "~/modules/exchange/Deal_Message.controller";
import { Deal_Message_Repository } from "~/modules/exchange/Deal_Message.repository";
import { useDeal_Value } from "../Deal.context";

//

export function Deal_Discussion_Form() {
  const [deal] = useDeal_Value();
  const { data: session } = useSession();
  const repository = new Deal_Message_Repository(
    fromClient,
    session?.user?.jwt,
    deal.get("id"),
  );

  const {
    create: { useMutation },
  } = new Deal_Message_Controller(repository);

  const { mutate: send_message } = useMutation();

  // const send_message = (message: string) => {
  //   // console.log("sending message to ?", { message, deal });
  // };
  return (
    <Formik
      initialValues={{
        message: "",
      }}
      enableReinitialize
      onSubmit={async (value, formik) => {
        send_message(value.message);
        formik.resetForm();
      }}
    >
      {({ isSubmitting }) => (
        <Form className="w-full">
          <Input
            name="message"
            disabled={isSubmitting}
            placeholder="Envoie un Message…"
          />
        </Form>
      )}
    </Formik>
  );
}

const Input = tw((props: FieldAttributes<unknown>) => <Field {...props} />)`
  block
  w-full
  rounded-2xl
  border
  border-[#33333333]
  px-4
  py-3
  text-sm
  xl:max-w-[400px]
`;