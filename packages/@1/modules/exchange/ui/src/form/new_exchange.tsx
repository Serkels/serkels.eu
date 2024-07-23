//

import { FrenchLocationField } from ":components/FrenchLocationField";
import type { Category } from "@1.modules/category.domain";
import { SelectCategoryField } from "@1.modules/category.ui/form/SelectCategoryField";
import {
  Exchange_TypeSchema,
  type Exchange_Create,
} from "@1.modules/exchange.domain";
import { Button } from "@1.ui/react/button";
import { fieldset, input, select } from "@1.ui/react/form/atom";
import { ErrorMessage, Field, Form, type FormikProps } from "formik";
import type { ChangeEvent, ComponentProps, PropsWithChildren } from "react";
import { createSlot } from "react-slotify";
//

interface Exchange_CreateForm_Props<TValues>
  extends PropsWithChildren<FormikProps<TValues>> {
  categories: Category[];
  alreadyPopulated?: boolean;
}

export function Exchange_CreateForm<
  TValues extends Pick<Exchange_Create, "type" | "is_online"> & {
    return: string;
  },
>({
  categories,
  children,
  isSubmitting,
  setFieldValue,
  values,
  alreadyPopulated,
}: Exchange_CreateForm_Props<TValues>) {
  const isDisabled = isSubmitting || alreadyPopulated;

  return (
    <Form className="flex flex-col justify-center space-y-5">
      <fieldset className={fieldset()} disabled={isDisabled}>
        <label>
          <span>Je cherche</span>
          <Field
            checked={values.type === Exchange_TypeSchema.Enum.RESEARCH}
            disabled={isDisabled}
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
            disabled={isDisabled}
            name="type"
            required
            type="radio"
            value={Exchange_TypeSchema.Enum.PROPOSAL}
          />
        </label>
      </fieldset>
      <fieldset className={fieldset()} disabled={isDisabled}>
        <label>
          <span>En ligne</span>{" "}
          <Field
            checked={values.is_online === true}
            disabled={isDisabled}
            name="is_online"
            onChange={() => setFieldValue("is_online", true)}
            required
            type="radio"
          />
        </label>
        <label>
          <span>Sur place</span>{" "}
          <Field
            checked={values.is_online === false}
            disabled={isDisabled}
            name="is_online"
            onChange={() => setFieldValue("is_online", false)}
            required
            type="radio"
          />
        </label>
      </fieldset>
      {values.is_online ? null : (
        <label>
          <span className="text-Silver_Chalice">Ville</span>
          <FrenchLocationField name="location" />
          {/* 
          <Exchange_CreateForm.LocationField.Renderer
            childs={children}
            name="location"
            disabled={isDisabled}
          >
            <Field
              className={input()}
              disabled={isDisabled}
              name="location"
              required
            />
          </Exchange_CreateForm.LocationField.Renderer> */}
        </label>
      )}
      <label>
        <span className="text-Silver_Chalice">Dans quelle categorie ?</span>

        <SelectCategoryField
          categories={categories}
          disabled={isDisabled}
          name="category"
          className={select()}
          placeholder="Dans quelle categorie ?"
          required={true}
        />
      </label>
      <label>
        <span className="text-Silver_Chalice">Date limite ?</span>

        <Field
          className={input()}
          disabled={isDisabled}
          type="date"
          name="expiry_date"
        />
      </label>
      <label>
        <span className="text-Silver_Chalice">Titre</span>

        <Field
          className={input()}
          disabled={isDisabled}
          name="title"
          required
        />
        <ErrorMessage name="title">
          {(msg) => <div className="text-danger">{msg}</div>}
        </ErrorMessage>
      </label>
      <label>
        <span className="text-Silver_Chalice">Description</span>

        <Field
          className={input()}
          disabled={isDisabled}
          component="textarea"
          name="description"
          required
        />

        <ErrorMessage name="description">
          {(msg) => <div className="text-danger">{msg}</div>}
        </ErrorMessage>
      </label>

      <label>
        <span className="text-Silver_Chalice">Nombre de places</span>

        <Field
          className={input()}
          disabled={isDisabled}
          maxLength={9}
          minLength={1}
          name="places"
          required
          type="number"
        />
        <ErrorMessage name="places">
          {(msg) => <div className="text-danger">{msg}</div>}
        </ErrorMessage>
      </label>

      <fieldset className={fieldset({ horizontal: true })}>
        <label className="flex  gap-2">
          <span>Sans échange</span>
          <Field disabled={isDisabled} value="" name="return" type="radio" />
        </label>
        <label className="flex gap-2">
          <div className="flex  gap-2">
            <span className="w-max">Contre un échange</span>
            <Field
              checked={Boolean(values.return)}
              disabled={true}
              type="radio"
            />
          </div>
          <SelectCategoryField
            categories={categories}
            disabled={isDisabled}
            name="return"
            className={select()}
            placeholder="Dans quelle categorie ?"
            onChange={(event: ChangeEvent<HTMLSelectElement>) => {
              setFieldValue("return", event.target.value);
            }}
          />
        </label>
      </fieldset>

      <Button isDisabled={isDisabled} type="submit">
        Publier
      </Button>
    </Form>
  );
}

Exchange_CreateForm.LocationField = createSlot<ComponentProps<"input">>();
