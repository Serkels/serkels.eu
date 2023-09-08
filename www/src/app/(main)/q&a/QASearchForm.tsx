"use client";

import { InputSearch } from "@1/ui/components/InputSearch";
import { Form, Formik, useField } from "formik";
import type { ComponentPropsWithoutRef } from "react";
import { useSyncSearchQuery } from "~/components/useSyncSearchQuery";

//

export function QASearchForm() {
  const { query, setQuery } = useSyncSearchQuery("q");
  return (
    <Formik
      initialValues={{ query }}
      onSubmit={(values) => setQuery(values.query)}
    >
      {({}) => (
        <Form>
          <QueryInputSearch />
        </Form>
      )}
    </Formik>
  );
}

function QueryInputSearch(props: ComponentPropsWithoutRef<"input">) {
  const [field] = useField("query");
  return <InputSearch {...field} {...props} />;
}
