"use client";

import { Button } from "@1.ui/react/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

//

export function CreateAnswerForm({
  onSubmit,
}: {
  onSubmit: (values: { content: string }) => void;
}) {
  const {
    formState: { isSubmitting, isLoading, errors },
    handleSubmit,
    register,
  } = useForm<FormValues>({
    resolver: zodResolver(form_zod_schema),
  });
  return (
    <form className="flex-1" onSubmit={handleSubmit(onSubmit)}>
      <fieldset className="mb-7">
        <textarea
          {...register("content")}
          autoComplete="off"
          className={`
            w-full
            resize-none
            rounded-sm
            border
            border-solid
            border-[#dddddd]
            px-4
            py-3
            placeholder-Silver_Chalice
            md:col-span-6
          `}
          disabled={isSubmitting || isLoading}
          placeholder="Votre réponse ..."
        ></textarea>

        {errors.content ? (
          <div className="text-danger">{errors.content.message}</div>
        ) : null}
      </fieldset>
      <div className="flex justify-between">
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

//

const form_zod_schema = z.object({
  content: z.string().trim().max(705).min(1, "Obligatoire"),
});
type FormValues = z.infer<typeof form_zod_schema>;
