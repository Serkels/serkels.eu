//

import type { Category } from "@1.modules/category.domain";
import { SelectCategoryField } from "@1.modules/category.ui/form/SelectCategoryField";
import {
  Exchange_TypeSchema,
  type Exchange_Create,
} from "@1.modules/exchange.domain";
import { Button } from "@1.ui/react/button";
import { fieldset, input, select } from "@1.ui/react/form/atom";
import { Field, Form, type FormikProps } from "formik";
import type { ChangeEvent } from "react";

//

export function Exchange_CreateForm<
  TValues extends Pick<Exchange_Create, "type" | "is_online"> & {
    return: string;
  },
>({
  categories,
  isSubmitting,
  setFieldValue,
  values,
}: FormikProps<TValues> & {
  categories: Category[];
}) {
  return (
    <Form className="flex flex-col justify-center space-y-5">
      <fieldset className={fieldset()} disabled={isSubmitting}>
        <label>
          <span>Je cherche</span>
          <Field
            checked={values.type === Exchange_TypeSchema.Enum.RESEARCH}
            disabled={isSubmitting}
            name="type"
            required
            type="radio"
            value={Exchange_TypeSchema.Enum.RESEARCH}
          />
        </label>
        <label>
          <span>Je propose</span>
          <Field
            checked={values.type === Exchange_TypeSchema.Enum.PROPOSAL}
            disabled={isSubmitting}
            name="type"
            required
            type="radio"
            value={Exchange_TypeSchema.Enum.PROPOSAL}
          />
        </label>
      </fieldset>
      <fieldset className={fieldset()} disabled={isSubmitting}>
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
      </fieldset>
      <label>
        <span className="text-Silver_Chalice">Dans quelle categorie ?</span>

        <SelectCategoryField
          categories={categories}
          disabled={isSubmitting}
          name="category"
          className={select()}
          placeholder="Dans quelle categorie ?"
          required={true}
        />
      </label>
      <label>
        <span className="text-Silver_Chalice">Quand ?</span>

        <Field
          className={input()}
          disabled={isSubmitting}
          type="date"
          name="expiry_date"
          required
        />
      </label>
      <label>
        <span className="text-Silver_Chalice">Titre</span>

        <Field
          className={input()}
          disabled={isSubmitting}
          name="title"
          required
        />
      </label>
      <label>
        <span className="text-Silver_Chalice">Description</span>

        <Field
          className={input()}
          disabled={isSubmitting}
          component="textarea"
          name="description"
          required
        />
      </label>
      <label>
        <span className="text-Silver_Chalice">Lieu</span>

        <Field className={input()} disabled={isSubmitting} name="location" />
      </label>

      <label>
        <span className="text-Silver_Chalice">Nombre de places</span>

        <Field
          className={input()}
          disabled={isSubmitting}
          maxLength={9}
          minLength={1}
          name="places"
          required
          type="number"
        />
      </label>

      <fieldset className={fieldset()}>
        <label>
          <span>Sans échange</span>{" "}
          <Field disabled={isSubmitting} value="" name="return" type="radio" />
        </label>
        <label>
          <span className="w-full"> Contre un échange</span>
          <Field
            checked={Boolean(values.return)}
            disabled={true}
            type="radio"
          />
          <SelectCategoryField
            categories={categories}
            disabled={isSubmitting}
            name="return"
            className={select()}
            placeholder="Dans quelle categorie ?"
            onChange={(event: ChangeEvent<HTMLSelectElement>) => {
              setFieldValue("return", event.target.value);
            }}
          />
        </label>
      </fieldset>

      <Button isDisabled={isSubmitting} type="submit">
        Terminer
      </Button>
    </Form>
  );
}
