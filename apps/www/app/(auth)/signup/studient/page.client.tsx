"use client";

import { Button } from ":components/button";
import { Formik } from "formik";

export default function Form() {
  return (
    <Formik
      initialValues={{}}
      onSubmit={() => {}}
      validate={() => {
        return {};
      }}
    >
      {({ handleSubmit, isSubmitting }) => (
        <form onSubmit={handleSubmit}>
          <Button type="submit" isDisabled={isSubmitting}>
            Terminer
          </Button>
        </form>
      )}
    </Formik>
  );
}
