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
      className="
        grid
        grid-cols-1
        gap-5
        rounded-md
        border
        bg-white
        px-4
        py-5
        text-Dove_Gray
        shadow-[10px_10px_10px_#00000029]
      "
    >
      <h1 className="text-center text-sm font-bold uppercase">
        Créer un compte
      </h1>
      <input
        // id="email"
        // name="email"
        // onChange={formik.handleChange}
        placeholder="Adresse email"
        type="email"
        className="h-8 rounded-sm border border-solid border-[#dddddd] px-3 py-2 text-xs placeholder-[#AAAAAA]"
        // value={formik.values.email}
      />
      <button
        type="submit"
        className="color-white mx-[11%] h-7 rounded-full border-none bg-Cerulean text-xs font-bold text-white"
        disabled={true}
      >
        Étudiant
      </button>
      <button
        type="submit"
        className="color-white mx-[11%] h-7 rounded-full border-none bg-RedViolet text-xs font-bold text-white"
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
        className="h-8 rounded-sm border border-solid border-[#dddddd] px-3 py-2 text-xs placeholder-[#AAAAAA]"
        value={formik.values.email}
      />
      <button
        type="submit"
        className="color-white mx-[11%] h-7 rounded-full border-none bg-Chateau_Green text-xs font-bold text-white"
        disabled={formik.isSubmitting}
      >
        Se connecter
      </button>
    </form>
  );
}

//

type Props = { onSubmit: FormikConfig<{ email: string }>["onSubmit"] };
