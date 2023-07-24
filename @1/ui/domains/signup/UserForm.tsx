//

import type { components } from "@1/strapi-openapi/v1";
import { useFormik, type FormikConfig } from "formik";
import type { ElementType } from "react";
import { UserAvatarFilled } from "../../icons/UserAvatarFilled";

//

export type FormValues = Omit<components["schemas"]["UserProfile"], ""> & {
  email?: string;
};

export function UserForm({ onSubmit, csrf: csrfToken, email, profile }: Props) {
  const formik = useFormik<FormValues>({
    initialValues: {
      about: profile.about ?? "",
      email: email ?? "",
      firstname: profile.firstname,
      lastname: profile.lastname,
      university: profile.university ?? "",
    },

    onSubmit,
  });

  return (
    <form
      className="flex flex-col justify-center space-y-5"
      onSubmit={formik.handleSubmit}
    >
      <div className="mx-auto">
        <UserAvatarFilled className="h-14 w-14" />
      </div>
      <div className="grid grid-cols-12 gap-5">
        <input
          className="col-span-full h-8 rounded-sm border border-solid border-[#dddddd] px-3 py-2 text-xs placeholder-[#AAAAAA] md:col-span-4"
          id="firstname"
          name="firstname"
          onChange={formik.handleChange}
          placeholder="Prenom"
          required
          type="text"
          value={formik.values.firstname}
        />
        <input
          className="col-span-full h-8 rounded-sm border border-solid border-[#dddddd] px-3 py-2 text-xs placeholder-[#AAAAAA] md:col-span-4"
          id="lastname"
          name="lastname"
          onChange={formik.handleChange}
          placeholder="Nom"
          required
          type="text"
          value={formik.values.lastname}
        />
        {/* <input
          className="col-span-full h-8 rounded-sm border border-solid border-[#dddddd] px-3 py-2 text-xs placeholder-[#AAAAAA] md:col-span-4"
          id="birthday"
          name="birthday"
          onChange={formik.handleChange}
          placeholder="Date de naissance"
          type="date"
          value={formik.values.birthday}
        /> */}
        <input
          className="col-span-full h-8 rounded-sm border border-solid border-[#dddddd] px-3 py-2 text-xs placeholder-[#AAAAAA] md:col-span-6"
          id="university"
          name="university"
          onChange={formik.handleChange}
          placeholder="Université"
          type="text"
          value={formik.values.university}
        />
        {/* <input
          className="col-span-full h-8 rounded-sm border border-solid border-[#dddddd] px-3 py-2 text-xs placeholder-[#AAAAAA] md:col-span-6"
          id="domain"
          name="domain"
          onChange={formik.handleChange}
          placeholder="Domaine"
          type="text"
          value={formik.values.domain}
        /> */}
        <textarea
          className="col-span-full h-24 rounded-sm border border-solid border-[#dddddd] px-3 py-2 text-xs placeholder-[#AAAAAA] md:col-span-12"
          id="about"
          name="about"
          onChange={formik.handleChange}
          placeholder="À propos"
          value={formik.values.about}
        />
        {/* <input
          className="col-span-full h-8 rounded-sm border border-solid border-[#dddddd] px-3 py-2 text-xs placeholder-[#AAAAAA] md:col-span-6"
          id="city"
          name="city"
          onChange={formik.handleChange}
          placeholder="Ville"
          type="text"
          value={formik.values.city}
          disabled
        /> */}
        <label className="col-span-full flex items-center space-x-1">
          <span>Email :</span>
          <input
            className="col-span-full h-8 rounded-sm border border-solid border-[#dddddd] px-3 py-2 text-xs placeholder-[#AAAAAA] md:col-span-6"
            id="email"
            name="email"
            onChange={formik.handleChange}
            placeholder="Email"
            type="text"
            value={formik.values.email}
            disabled={Boolean(email)}
          />
        </label>
        <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
        <input name="role" type="hidden" defaultValue="user" />
      </div>
      <button type="submit" disabled={formik.isSubmitting}>
        Terminer
      </button>
    </form>
  );
}

//

type Props = {
  email: string | undefined;
  profile: components["schemas"]["UserProfile"];
  csrf?: string;
  Avatar?: ElementType;
  onSubmit: FormikConfig<FormValues>["onSubmit"];
};
