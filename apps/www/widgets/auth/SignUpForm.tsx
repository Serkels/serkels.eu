"use client";

import signup_action from "@1.modules/auth.next/actions/signup";
import type { Category } from "@1.modules/category.domain";
import { OptionCategories } from "@1.modules/category.ui/form/select";
import {
  NewProfile_Schema,
  NewStudent_Schema,
  PROFILE_ROLES,
} from "@1.modules/profile.domain";
import { Button } from "@1.ui/react/button";
import { input, select } from "@1.ui/react/form/atom";
import { UserAvatarFilled } from "@1.ui/react/icons";
import { VisuallyHidden } from "@1.ui/react/visually_hidden";
import { useServerAction } from "@1.ui/react/zsa/react";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { tv } from "tailwind-variants";
import { z } from "zod";

//

type FormProps = {
  categories: Category[];
};

const form_zod_schema = NewProfile_Schema.extend({
  bio: z.string().trim().default(""),
  context: NewStudent_Schema,
});

type FormValues = z.infer<typeof form_zod_schema>;

//

export default function Form({ categories }: FormProps) {
  const form = useForm<FormValues>();
  const {
    handleSubmit,
    register,
    formState: { isSubmitSuccessful, isSubmitting },
  } = form;

  const { execute } = useServerAction(signup_action);

  const { base } = style();
  return (
    <FormProvider {...form}>
      <div className="mx-auto">
        <UserAvatarFilled className="h-14 w-14 text-gray-400" />
        <VisuallyHidden>Créer d'un compte étudiant</VisuallyHidden>
      </div>

      <form
        className={base()}
        onSubmit={handleSubmit((values) => execute(values))}
      >
        <input
          {...register("role")}
          type="hidden"
          value={PROFILE_ROLES.enum.STUDENT}
        />
        <Name_Field />
        <University_Field />
        <FieldOfStudy_Field />
        <Biography_Field />
        <City_Field />
        <Language_Field />
        <Interest_Field categories={categories} />

        <Button
          className="mx-auto min-w-44"
          isDisabled={isSubmitting || isSubmitSuccessful}
          type="submit"
          size="lg"
        >
          Terminer
        </Button>
      </form>
    </FormProvider>
  );
}

function Name_Field() {
  const {
    register,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useFormContext<FormValues>();

  return (
    <label>
      <span className="text-Silver_Chalice">Nom et prénom</span>

      <input
        {...register("name")}
        className={input()}
        disabled={isSubmitting || isSubmitSuccessful}
        placeholder="Prenom et Nom"
        required
      />
      {errors.name && <div className="text-danger">{errors.name.message}</div>}
    </label>
  );
}

function University_Field() {
  const {
    register,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useFormContext<FormValues>();

  return (
    <label>
      <span className="text-Silver_Chalice">Université</span>

      <input
        {...register("context.university")}
        className={input()}
        disabled={isSubmitting || isSubmitSuccessful}
        placeholder="Université"
        required
      />
      {errors.context?.university && (
        <div className="text-danger">{errors.context.university.message}</div>
      )}
    </label>
  );
}

function FieldOfStudy_Field() {
  const {
    register,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useFormContext<FormValues>();

  return (
    <label>
      <span className="text-Silver_Chalice">Domaine d'étude</span>

      <input
        {...register("context.field_of_study")}
        className={input()}
        disabled={isSubmitting || isSubmitSuccessful}
        placeholder="Domaine d'étude"
        required
      />
      {errors.context?.field_of_study && (
        <div className="text-danger">
          {errors.context.field_of_study.message}
        </div>
      )}
    </label>
  );
}

function City_Field() {
  const {
    register,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useFormContext<FormValues>();

  return (
    <label>
      <span className="text-Silver_Chalice">Ville</span>

      <input
        {...register("context.city")}
        className={input()}
        disabled={isSubmitting || isSubmitSuccessful}
        placeholder="Ville"
        required
      />
      {errors.context?.city && (
        <div className="text-danger">{errors.context.city.message}</div>
      )}
    </label>
  );
}

function Language_Field() {
  const {
    register,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useFormContext<FormValues>();

  return (
    <label>
      <span className="text-Silver_Chalice">Langues parlées</span>

      <input
        {...register("context.language")}
        className={input()}
        disabled={isSubmitting || isSubmitSuccessful}
        placeholder="Langues parlées"
        required
      />
      {errors.context?.language && (
        <div className="text-danger">{errors.context.language.message}</div>
      )}
    </label>
  );
}
function Biography_Field() {
  const {
    register,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useFormContext<FormValues>();

  return (
    <label>
      <span className="text-Silver_Chalice">Biographie</span>

      <textarea
        {...register("bio")}
        className={input()}
        disabled={isSubmitting || isSubmitSuccessful}
        placeholder="Biographie"
      />
      {errors.bio && <div className="text-danger">{errors.bio.message}</div>}
    </label>
  );
}

function Interest_Field({ categories }: { categories: Category[] }) {
  const {
    register,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useFormContext<FormValues>();

  return (
    <label>
      <span className="text-Silver_Chalice">Dans quelle categorie ?</span>

      <select
        {...register("context.interest_id")}
        className={select()}
        disabled={isSubmitting || isSubmitSuccessful}
        required
      >
        <option hidden value="">
          Intéressé.e par
        </option>
        <OptionCategories categories={categories} />
      </select>
      {errors.context?.interest_id && (
        <div className="text-danger">{errors.context.interest_id.message}</div>
      )}
    </label>
  );
}

const style = tv({
  base: "flex flex-col justify-center space-y-10 p-4",
  slots: {
    form: "flex flex-col justify-center space-y-10",
    label: "col-span-full flex items-center space-x-1",
  },
});
