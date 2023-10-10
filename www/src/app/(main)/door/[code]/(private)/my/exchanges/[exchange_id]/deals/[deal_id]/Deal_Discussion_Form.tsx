"use client";

import { useInject } from "@1/core/ui/di.context.client";
import { Field, Form, Formik, type FieldAttributes } from "formik";
import tw from "tailwind-styled-components";
import { Deal_Message_Controller } from "~/modules/exchange/Deal_Message.controller";
import { useDeal_Value } from "../Deal.context";

//

export function Deal_Discussion_Form() {
  const [deal] = useDeal_Value();

  const {
    create: { useMutation },
  } = useInject(Deal_Message_Controller);

  const { mutate: send_message } = useMutation(deal.id);

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
