//

import { useFormik, type FormikConfig } from "formik";

export function LoginForm({ onSubmit }: Props) {
  const formik = useFormik({
    initialValues: {
      email: "",
    },

    onSubmit,
  });
  return (
    <form
      onSubmit={formik.handleSubmit}
      un-bg="white"
      un-p="lg"
      un-grid="~ cols-1"
      un-gap="2xl"
    >
      <input
        id="email"
        name="email"
        onChange={formik.handleChange}
        placeholder="Adresse email"
        type="email"
        un-h="12"
        un-placeholder="#aaa"
        un-px="2xl"
        un-text="lg"
        value={formik.values.email}
      />
      <button
        type="submit"
        un-bg="#00adee"
        un-border="none"
        un-color="white"
        un-font="bold"
        un-h="12"
        un-rounded="6"
        un-text="5"
        disabled={formik.isSubmitting}
      >
        Se connecter
      </button>
    </form>
  );
}

//

type Props = { onSubmit: FormikConfig<{ email: string }>["onSubmit"] };
