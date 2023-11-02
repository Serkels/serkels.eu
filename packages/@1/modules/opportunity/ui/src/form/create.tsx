"use client";

import type { Category } from "@1.modules/category.domain";
import { SelectCategoryField } from "@1.modules/category.ui/form/SelectCategoryField";
import type { Opportunity_Create } from "@1.modules/opportunity.domain";
import { Button } from "@1.ui/react/button";
import { fieldset, input, label, select } from "@1.ui/react/form/atom";
import { Montains } from "@1.ui/react/icons";
import { format } from "date-fns";
import { ErrorMessage, Field, Form, type FormikProps } from "formik";
import { match } from "ts-pattern";

//

export function Opportunity_CreateForm({
  categories,
  errors,
  isSubmitting,
  setFieldValue,
  touched,
  values,
}: FormikProps<Opportunity_Create> & {
  categories: Category[];
}) {
  return (
    <Form className="flex flex-col justify-center space-y-5">
      <fieldset>
        <label className={label()} htmlFor="title">
          Title
        </label>
        <Field
          className={input({
            wrong_value: Boolean(errors.title && touched.title),
          })}
          type="text"
          name="title"
          id="title"
          required={true}
        />
        <ErrorMessage name="title">
          {(msg) => <div className="text-danger">{msg}</div>}
        </ErrorMessage>
      </fieldset>

      <fieldset>
        <label className={label()} htmlFor="expiry_date">
          Date limite
        </label>
        <Field
          className={input({
            wrong_value: Boolean(errors.expiry_date && touched.expiry_date),
          })}
          min={format(new Date(), "yyyy-MM-dd")}
          name="expiry_date"
          id="expiry_date"
          required={true}
          type="date"
        />
        <ErrorMessage name="date">
          {(msg) => <div className="text-danger">{msg}</div>}
        </ErrorMessage>
      </fieldset>

      <fieldset>
        <label className={label()} htmlFor="cover">
          Couverture
        </label>
        <Field
          className={input({
            wrong_value: Boolean(errors.cover && touched.cover),
          })}
          type="url"
          name="cover"
          id="cover"
          placeholder="URL de l'image de couverture"
          required={true}
        />
        <ErrorMessage name="cover">
          {(msg) => <div className="text-danger">{msg}</div>}
        </ErrorMessage>
        {match(values.cover)
          .with("", () => (
            <div className="flex min-h-[33vh] items-center justify-center bg-[#BABFC4A8] text-[#919ba3]">
              <Montains />
            </div>
          ))
          .otherwise(() => (
            <div className="flex min-h-[33vh] items-center justify-center bg-[#BABFC4A8] text-[#919ba3]">
              <img
                className="h-auto w-full max-w-full "
                width="700"
                height="368"
                src={values.cover}
              />
            </div>
          ))}
      </fieldset>

      <fieldset>
        <label className={label()} htmlFor="description">
          Description
        </label>
        <Field
          as="textarea"
          autoComplete="off"
          className={input({
            wrong_value: Boolean(errors.description && touched.description),
          })}
          disabled={isSubmitting}
          name="description"
          id="description"
          required={true}
          rows={5}
        />
        <ErrorMessage name="description">
          {(msg) => <div className="text-danger">{msg}</div>}
        </ErrorMessage>
      </fieldset>

      <fieldset className={fieldset()} disabled={isSubmitting}>
        <label>
          <span>En ligne</span>{" "}
          <Field
            checked={values.is_online === true}
            disabled={isSubmitting}
            name="is_online"
            onChange={() => {
              setFieldValue("is_online", true);
              setFieldValue("location", undefined);
            }}
            required
            type="radio"
          />
        </label>
        <label>
          <span>Sur place</span>{" "}
          <Field
            checked={values.is_online === false}
            disabled={isSubmitting}
            name="is_online"
            onChange={() => setFieldValue("is_online", false)}
            required
            type="radio"
          />
        </label>
        <ErrorMessage name="is_online">
          {(msg) => <div className="text-danger">{msg}</div>}
        </ErrorMessage>
      </fieldset>

      <fieldset>
        <label className={label()} htmlFor="location">
          Lieu
        </label>
        <Field
          className={input({
            wrong_value: Boolean(errors.location && touched.location),
          })}
          type="text"
          name="location"
          id="location"
          required={!values.is_online}
          disabled={isSubmitting || values.is_online}
        />
        <ErrorMessage name="location">
          {(msg) => <div className="text-danger">{msg}</div>}
        </ErrorMessage>
      </fieldset>

      {/* <div className="grid grid-cols-2 gap-5"> */}
      <div>
        <SelectCategoryField
          categories={categories}
          disabled={isSubmitting}
          name="category"
          className={select({ className: "px-5 py-2" })}
          placeholder="Dans quelle categorie ?"
          required={true}
        />
        <ErrorMessage name="category">
          {(msg) => <div className="text-danger">{msg}</div>}
        </ErrorMessage>
      </div>

      <fieldset>
        <label className={label()} htmlFor="link">
          Lien web
        </label>
        <Field
          className={input({
            wrong_value: Boolean(errors.link && touched.link),
          })}
          type="url"
          name="link"
          id="link"
          required
        />
        <ErrorMessage name="link">
          {(msg) => <div className="text-danger">{msg}</div>}
        </ErrorMessage>
      </fieldset>

      <div className="flex justify-center">
        <Button isDisabled={isSubmitting} type="submit">
          Publier
        </Button>
      </div>
    </Form>
  );
}
