//

import type { Exchange_CreateProps } from "@1/modules/exchange/domain";
import clsx from "clsx";
import {
  Field,
  Form,
  Formik,
  type FieldAttributes,
  type FormikConfig,
} from "formik";
import type { ChangeEvent, ComponentPropsWithoutRef } from "react";
import { Button } from "../../components/ButtonV";

//

export type FormValues = Pick<
  Exchange_CreateProps,
  | "type"
  | "is_online"
  | "category"
  | "description"
  | "title"
  | "location"
  | "places"
  | "in_exchange_of"
>;
export type Exchange_Types = Exchange_CreateProps["type"];

// const initialValues: Partial<Exchange_CreateProps> = {
//   available_places: number,
// } as const;
export function CreateForm({
  onSubmit,
  "slot-CategoryField": slotCategoryField,
  "slot-InExchangeOf": slotInExchangeOf,
}: Props) {
  return (
    <Formik
      initialValues={{
        type: "proposal",
        is_online: true,
        category: NaN,
        description: "",
        title: "",
        places: 1,
        in_exchange_of: NaN,
        when: undefined,
      }}
      onSubmit={onSubmit}
    >
      {({ setFieldValue, values }) => (
        <Form className="flex flex-col justify-center space-y-5">
          <Fieldset>
            <label>
              <span>Je cherche</span>
              <Field
                type="radio"
                name="type"
                value={"proposal" as Exchange_Types}
                required
              />
            </label>
            <label>
              <span>Je propose</span>
              <Field
                type="radio"
                name="type"
                value={"research" as Exchange_Types}
                required
              />
            </label>
          </Fieldset>
          <Fieldset>
            <label>
              <span>En ligne</span>{" "}
              <Field
                checked={values.is_online === true}
                name="is_online"
                onChange={() => setFieldValue("is_online", true)}
                required
                type="radio"
              />
            </label>
            <label>
              <span> Sur place</span>{" "}
              <Field
                checked={values.is_online === false}
                name="is_online"
                onChange={() => setFieldValue("is_online", false)}
                required
                type="radio"
              />
            </label>
          </Fieldset>
          <label>
            <span className="text-Silver_Chalice">Dans quelle categorie ?</span>

            {slotCategoryField({
              name: "category",
              className: clsx(`
                w-full
                border
                border-Silver_Chalice
                px-5
                py-2 
              `),
              placeholder: "Dans quelle categorie ?",
              required: true,
            } satisfies FieldAttributes<unknown>)}
          </label>
          <label>
            <span className="text-Silver_Chalice">Quand ?</span>

            <InputField type="date" name="when" required />
          </label>
          <label>
            <span className="text-Silver_Chalice">Titre</span>

            <InputField name="title" required />
          </label>
          <label>
            <span className="text-Silver_Chalice">Description</span>

            <InputField component="textarea" name="description" required />
          </label>
          <label>
            <span className="text-Silver_Chalice">Lieu</span>

            <InputField name="location" />
          </label>

          <label>
            <span className="text-Silver_Chalice">Nombre de places</span>

            <InputField
              className="
              "
              name="places"
              type="number"
            />
          </label>

          <Fieldset>
            <label>
              <span>Sans échange</span>{" "}
              <Field
                checked={Number.isNaN(values.in_exchange_of)}
                onChange={() => setFieldValue("in_exchange_of", NaN)}
                type="radio"
              />
            </label>
            <label>
              <span> Sur place</span>{" "}
              <Field
                checked={Number.isInteger(values.in_exchange_of)}
                type="radio"
              />
              {slotInExchangeOf({
                name: "in_exchange_of",
                className: clsx(`
                w-full
                border
                border-Silver_Chalice
              `),
                placeholder: "Dans quelle categorie ?",
                required: true,
                onChange(event: ChangeEvent<HTMLSelectElement>) {
                  setFieldValue("in_exchange_of", Number(event.target.value));
                },
              } satisfies FieldAttributes<unknown>)}
            </label>
          </Fieldset>

          <Button type="submit">Terminer</Button>
        </Form>
      )}
    </Formik>
  );
}

export function InputField(props: FieldAttributes<{}>) {
  const { className, ...other_props } = props;
  return (
    <Field
      className={clsx(
        `
        w-full 
        rounded-sm
        border
        border-solid
        border-Silver_Chalice
        px-4 py-3
        placeholder-black
        `,
        className,
      )}
      {...other_props}
    ></Field>
  );
}
export function Fieldset(props: ComponentPropsWithoutRef<"fieldset">) {
  const { className, ...other_props } = props;
  return (
    <fieldset
      className={clsx(
        `
        flex
        items-center
        justify-around
        rounded-md
        border
        border-Silver_Chalice
        bg-white
        py-2
        [&>label]:flex
        [&>label]:items-center
        [&>label]:space-x-3
        `,
        className,
      )}
      {...other_props}
    ></fieldset>
  );
}

//

type Props = {
  onSubmit: FormikConfig<FormValues>["onSubmit"];
  "slot-CategoryField": (props: FieldAttributes<any>) => React.ReactNode;
  "slot-InExchangeOf": (props: FieldAttributes<any>) => React.ReactNode;
};
