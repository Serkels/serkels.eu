//

import { Form } from "@1/ui/domains/exchange/AskModal";
import { Field, Formik, type FieldAttributes } from "formik";
import tw from "tailwind-styled-components";

//

export function Conversation_Form({
  send_message,
}: {
  send_message: (message: string) => Promise<void>;
}) {
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
