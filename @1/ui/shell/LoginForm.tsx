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
      className="bg-white p-4 grid text-black grid-cols-1 gap-5 rounded-md border "
      un-bg="white"
      un-p="lg"
      un-grid="~ cols-1"
    >
      <h1 className="uppercase text-center font-bold text-base">
        Créer un compte
      </h1>
      <input
        // id="email"
        // name="email"
        // onChange={formik.handleChange}
        placeholder="Adresse email"
        type="email"
        className="p-6 h-12 placeholder-slate-400 text-lg border border-solid border-black"
        // value={formik.values.email}
      />
      <button
        type="submit"
        className="border-none h-12 text-lg rounded-full font-bold color-white bg-Cerulean text-white"
        disabled={true}
      >
        Étudiant
      </button>
      <button
        type="submit"
        className="border-none h-12 text-lg rounded-full font-bold color-white bg-RedViolet text-white"
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
        className="p-6 h-12 placeholder-slate-400 text-lg border border-solid border-black"
        value={formik.values.email}
      />
      <button
        type="submit"
        className="border-none h-12 text-lg rounded-full font-bold color-white bg-Chateau_Green text-white"
        disabled={formik.isSubmitting}
      >
        Se connecter
      </button>
    </form>
  );
}

//

type Props = { onSubmit: FormikConfig<{ email: string }>["onSubmit"] };
