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
      className="grid grid-cols-1 gap-5 rounded-md border bg-white p-4 text-black "
      un-bg="white"
      un-p="lg"
      un-grid="~ cols-1"
    >
      <h1 className="text-center text-base font-bold uppercase">
        Créer un compte
      </h1>
      <input
        // id="email"
        // name="email"
        // onChange={formik.handleChange}
        placeholder="Adresse email"
        type="email"
        className="h-12 border border-solid border-black p-6 text-lg placeholder-slate-400"
        // value={formik.values.email}
      />
      <button
        type="submit"
        className="color-white h-12 rounded-full border-none bg-Cerulean text-lg font-bold text-white"
        disabled={true}
      >
        Étudiant
      </button>
      <button
        type="submit"
        className="color-white h-12 rounded-full border-none bg-RedViolet text-lg font-bold text-white"
        disabled={true}
      >
        Partenaire
      </button>
      <hr />
      <input
        id="email"
        name="email"
        onChange={formik.handleChange}
        placeholder="Adresse email"
        type="email"
        className="h-12 border border-solid border-black p-6 text-lg placeholder-slate-400"
        value={formik.values.email}
      />
      <button
        type="submit"
        className="color-white h-12 rounded-full border-none bg-Chateau_Green text-lg font-bold text-white"
        disabled={formik.isSubmitting}
      >
        Se connecter
      </button>
    </form>
  );
}

//

type Props = { onSubmit: FormikConfig<{ email: string }>["onSubmit"] };
