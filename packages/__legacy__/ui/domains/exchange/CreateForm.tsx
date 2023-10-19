//

import type { Exchange_CreateProps } from "@1/modules/exchange/domain";
import { type TypeProps } from "@1/modules/exchange/domain/Type.value";
import clsx from "clsx";
import { Field, Form, type FieldAttributes, type FormikProps } from "formik";
import type { ChangeEvent, ComponentPropsWithoutRef } from "react";
import { Button } from "../../components/ButtonV";

//

export function CreateForm({
  setFieldValue,
  values,
  isSubmitting,
  "slot-CategoryField": slotCategoryField,
  "slot-InExchangeOf": slotInExchangeOf,
}: Props) {
  return (
    <Form className="flex flex-col justify-center space-y-5">
      <Fieldset disabled={isSubmitting}>
        <label>
          <span>Je cherche</span>
          <Field
            checked={values.type === "research"}
            disabled={isSubmitting}
            name="type"
            required
            type="radio"
            value={"research" as TypeProps["value"]}
          />
        </label>
        <label>
          <span>Je propose</span>
          <Field
            checked={values.type === "proposal"}
            disabled={isSubmitting}
            name="type"
            required
            type="radio"
            value={"proposal" as TypeProps["value"]}
          />
        </label>
      </Fieldset>
      <Fieldset disabled={isSubmitting}>
        <label>
          <span>En ligne</span>{" "}
          <Field
            checked={values.is_online === true}
            disabled={isSubmitting}
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
            disabled={isSubmitting}
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
          disabled: isSubmitting,
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

        <InputField disabled={isSubmitting} type="date" name="when" required />
      </label>
      <label>
        <span className="text-Silver_Chalice">Titre</span>

        <InputField disabled={isSubmitting} name="title" required />
      </label>
      <label>
        <span className="text-Silver_Chalice">Description</span>

        <InputField
          disabled={isSubmitting}
          component="textarea"
          name="description"
          required
        />
      </label>
      <label>
        <span className="text-Silver_Chalice">Lieu</span>

        <InputField disabled={isSubmitting} name="location" />
      </label>

      <label>
        <span className="text-Silver_Chalice">Nombre de places</span>

        <InputField
          disabled={isSubmitting}
          className=""
          maxLength={100}
          minLength={1}
          name="places"
          required
          type="number"
        />
      </label>

      <Fieldset>
        <label>
          <span>Sans échange</span>{" "}
          <Field
            disabled={isSubmitting}
            value=""
            name="in_exchange_of"
            type="radio"
          />
        </label>
        <label>
          <span> Sur place</span>{" "}
          <Field
            checked={Boolean(values.in_exchange_of)}
            disabled={isSubmitting}
            type="radio"
          />
          {slotInExchangeOf({
            disabled: isSubmitting,
            name: "in_exchange_of",
            className: clsx(`
              w-full
              border
              border-Silver_Chalice
            `),
            placeholder: "Dans quelle categorie ?",
            onChange(event: ChangeEvent<HTMLSelectElement>) {
              setFieldValue("in_exchange_of", Number(event.target.value));
            },
          } satisfies FieldAttributes<unknown>)}
        </label>
      </Fieldset>

      <Button isDisabled={isSubmitting} type="submit">
        Terminer
      </Button>
    </Form>
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
        disabled:pointer-events-none
        disabled:opacity-50
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
        disabled:pointer-events-none
        disabled:opacity-50
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

type Props = FormikProps<Exchange_CreateProps> & {
  "slot-CategoryField": (props: FieldAttributes<any>) => React.ReactNode;
  "slot-InExchangeOf": (props: FieldAttributes<any>) => React.ReactNode;
};
