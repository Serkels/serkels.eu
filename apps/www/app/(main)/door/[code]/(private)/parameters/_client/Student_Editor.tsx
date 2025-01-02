"use client";

import { TRPC_React } from ":trpc/client";
import type { Category } from "@1.modules/category.domain";
import { OptionCategories } from "@1.modules/category.ui/form/select";
import { Student_Schema, type Student } from "@1.modules/profile.domain";
import { Button } from "@1.ui/react/button";
import { input, label } from "@1.ui/react/form/atom";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";

//

export default function Student_Editor({
  student: initial,
  categories,
}: {
  student: Student;
  categories: Category[];
}) {
  const student_id = initial.id;
  const utils = TRPC_React.useUtils();
  const router = useRouter();
  const query_student = TRPC_React.student.by_id.useQuery(student_id, {
    select: ({ created_at, updated_at, id, profile_id, ...student }) => student,
  });
  const update_student = TRPC_React.student.me.update.useMutation();

  const student = query_student.data ?? initial;
  const interest = initial.interest[0] ?? ({} as Category);

  const {
    formState: { isSubmitting, isDirty, errors, touchedFields },
    handleSubmit,
    register,
  } = useForm<FormValues>({
    defaultValues: {
      city: student.city ?? undefined,
      field_of_study: student.field_of_study ?? undefined,
      language: student.language ?? undefined,
      university: student.university,
      interest: interest.id,
    },
    resolver: zodResolver(form_zod_schema),
  });
  const names = Student_Schema.keyof().Enum;
  const on_submit: SubmitHandler<FormValues> = async (values) => {
    await update_student.mutateAsync({
      city: values.city ?? student.city ?? undefined,
      field_of_study:
        values.field_of_study ?? student.field_of_study ?? undefined,
      interest: [values.interest], // ?? student.interest ?? undefined,
      language: values.language ?? student.language ?? undefined,
      university: values.university ?? student.university ?? undefined,
    });
    await utils.student.by_id.invalidate(student_id);
    router.refresh();
  };

  return (
    <form className="grid grid-cols-1 gap-5" onSubmit={handleSubmit(on_submit)}>
      <fieldset>
        <label className={label()} htmlFor={names.university}>
          Université :
        </label>

        <input
          {...register(names.university)}
          className={input({
            className: "col-span-full",
            wrong_value: Boolean(errors.university && touchedFields.university),
          })}
          id={names.university}
          placeholder="Université..."
          required
          type="text"
          disabled={isSubmitting}
        />
        <AnimatePresence>
          {errors.university ? (
            <motion.div
              key={names.university}
              className="overflow-hidden text-right text-danger"
              initial={{ height: 0 }}
              animate={{ height: "auto" }}
              exit={{ height: 0 }}
            >
              {errors.university.message}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </fieldset>

      <fieldset>
        <label className={label()} htmlFor={names.field_of_study}>
          Domaine d'étude :
        </label>

        <input
          {...register(names.field_of_study)}
          className={input({
            className: "col-span-full",
            wrong_value: Boolean(
              errors.field_of_study && touchedFields.field_of_study,
            ),
          })}
          id={names.field_of_study}
          placeholder="Domaine d'étude..."
          required
          type="text"
          disabled={isSubmitting}
        />
        <AnimatePresence>
          {errors.field_of_study ? (
            <motion.div
              key={names.field_of_study}
              className="overflow-hidden text-right text-danger"
              initial={{ height: 0 }}
              animate={{ height: "auto" }}
              exit={{ height: 0 }}
            >
              {errors.field_of_study.message}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </fieldset>

      <fieldset>
        <label className={label()} htmlFor={names.city}>
          Ville :
        </label>

        <input
          {...register(names.city)}
          className={input({
            className: "col-span-full",
            wrong_value: Boolean(errors.city && touchedFields.city),
          })}
          id={names.city}
          placeholder="Ville..."
          required
          type="text"
          disabled={isSubmitting}
        />
        <AnimatePresence>
          {errors.city ? (
            <motion.div
              key={names.city}
              className="overflow-hidden text-right text-danger"
              initial={{ height: 0 }}
              animate={{ height: "auto" }}
              exit={{ height: 0 }}
            >
              {errors.city.message}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </fieldset>

      <fieldset>
        <label className={label()} htmlFor={names.language}>
          Langues parlées :
        </label>

        <input
          {...register(names.language)}
          className={input({
            className: "col-span-full",
            wrong_value: Boolean(errors.language && touchedFields.language),
          })}
          id={names.language}
          placeholder="Langues parlées..."
          required
          type="text"
          disabled={isSubmitting}
        />
        <AnimatePresence>
          {errors.language ? (
            <motion.div
              key={names.language}
              className="overflow-hidden text-right text-danger"
              initial={{ height: 0 }}
              animate={{ height: "auto" }}
              exit={{ height: 0 }}
            >
              {errors.language.message}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </fieldset>

      <fieldset>
        <label className={label()} htmlFor={names.interest}>
          Intéressé.e par :
        </label>

        <select
          {...register(names.interest)}
          className={input({
            className: "col-span-full",
            wrong_value: Boolean(errors.interest && touchedFields.interest),
          })}
          id={names.interest}
          required
          disabled={isSubmitting}
        >
          <option hidden value={""}>
            Intéressé.e par
          </option>
          <OptionCategories categories={categories} />
        </select>
        <AnimatePresence>
          {errors.interest ? (
            <motion.div
              key={names.interest}
              className="overflow-hidden text-right text-danger"
              initial={{ height: 0 }}
              animate={{ height: "auto" }}
              exit={{ height: 0 }}
            >
              {errors.interest.message}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </fieldset>

      <motion.div
        className="overflow-hidden text-right"
        animate={{ height: isDirty ? "auto" : 0 }}
        initial={{ height: 0 }}
      >
        <Button intent="primary" type="submit" isDisabled={isSubmitting}>
          Sauvegarder
        </Button>
      </motion.div>
    </form>
  );
}

const form_zod_schema = z.object({
  city: z.string().trim().max(42),
  field_of_study: z.string().trim().max(42),
  interest: z.string().trim().max(42),
  language: z.string().trim().max(42),
  university: z.string().trim().max(42).min(1, "Obligatoire"),
});
type FormValues = z.infer<typeof form_zod_schema>;
