//

import { client } from "@/api/client";
import type { components } from "@1/strapi-openapi/v1";
import { Field, Form, Formik } from "formik";
import { navigate } from "vite-plugin-ssr/client/router";
import * as Yup from "yup";

//

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
});

type StrapiErrorDetail = {
  message: string;
  name: string;
  path: string[];
};

function ErrorDetails(error: components["schemas"]["Error"]) {
  return error.error.details!["errors"] as any as StrapiErrorDetail[];
}

export function LoginForm() {
  return (
    <Formik
      initialValues={{ email: "", username: "foo", password: "bar" }}
      onSubmit={async (body, { setErrors }) => {
        const { data, error } = await client.post("/auth/local/register", {
          body,
        });

        if (error) {
          const details = ErrorDetails(error);
          setErrors(
            details.reduce((errors, detail) => {
              const name = detail.path[0] as keyof typeof body;
              return { ...errors, [name]: detail.message };
            }, {})
          );
          return;
        }

        console.info(data);

        await navigate("/signup/verify");
      }}
      validationSchema={LoginSchema}
    >
      {({ errors, touched, isSubmitting }) => (
        <Form>
          <Field name="email" type="email" />
          {errors.email && touched.email ? <div>{errors.email}</div> : null}
          <Field name="username" type="username" />
          {errors.username && touched.username ? (
            <div>{errors.username}</div>
          ) : null}
          <Field name="password" type="password" />
          {errors.password && touched.password ? (
            <div>{errors.password}</div>
          ) : null}
          <button type="submit" disabled={isSubmitting}>
            Submit
          </button>
        </Form>
      )}
    </Formik>
  );
}
