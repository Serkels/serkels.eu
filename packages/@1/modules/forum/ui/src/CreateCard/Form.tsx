"use client";

import type { Category } from "@1.modules/category.domain";
import { OptionCategories } from "@1.modules/category.ui/form/select";
import { Button } from "@1.ui/react/button";
import { input, select } from "@1.ui/react/form/atom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

//

export function CreateQuestionForm({
  categories,
  initialValues,
  onSubmit,
}: {
  categories: Category[];
  initialValues?: { title?: string; category?: string };
  onSubmit: (values: { title: string; category: string }) => void;
}) {
  const {
    formState: { isSubmitting, isLoading, errors },
    handleSubmit,
    register,
  } = useForm<FormValues>({
    defaultValues: initialValues,
    resolver: zodResolver(form_zod_schema),
  });

  return (
    <form className="flex-1" onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-7">
        <textarea
          {...register("title")}
          autoComplete="off"
          className={input({
            className: `
            peer
            max-h-32
            min-h-16
            w-full
            resize-none
            rounded-2xl
            pr-14
          `,
          })}
          disabled={isSubmitting || isLoading}
          placeholder="Pose une question aux étudiant.e.s ..."
        ></textarea>

        {errors.title ? (
          <div className="text-danger">{errors.title.message}</div>
        ) : null}
      </div>
      <div className="flex items-center justify-between gap-4">
        <select
          {...register("category")}
          disabled={isSubmitting || isLoading}
          className={select({
            className: "w-auto min-w-[25%] border border-[#dddddd]",
          })}
          required
        >
          <OptionCategories categories={categories} />
        </select>
        <Button
          type="submit"
          intent="primary"
          isDisabled={isSubmitting || isLoading}
          className="max-w-fit"
        >
          Envoyer
        </Button>
      </div>
    </form>
  );
}

const form_zod_schema = z.object({
  title: z.string().trim().max(705).min(1, "Obligatoire"),
  category: z.string().trim().min(1, "Obligatoire"),
});
type FormValues = z.infer<typeof form_zod_schema>;
