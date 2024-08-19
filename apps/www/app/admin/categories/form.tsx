"use client";

import { TRPC_React } from ":trpc/client";
import type { Category } from "@1.modules/category.domain";
import { Button } from "@1.ui/react/button";
import { input } from "@1.ui/react/form/atom";
import { motion } from "framer-motion";
import {
  useForm,
  type SubmitHandler,
  type UseFormProps,
} from "react-hook-form";

//

export function Form() {
  const { data } = TRPC_React.category.exchange.useQuery();
  if (!data) return null;

  return (
    <section className="space-y-4">
      <details>
        <summary>Créer une catégorie</summary>
        <Edit_Category />
      </details>
      <article className="space-y-4">
        <h2 className="text-xl font-bold">Exchanges</h2>
        <ul className="space-y-4">
          {data.map((category) => (
            <li key={category.id}>
              <Edit_Category defaultValues={category} />
            </li>
          ))}
        </ul>
      </article>
    </section>
  );
}

function Edit_Category(props: UseFormProps<Category>) {
  const {
    handleSubmit,
    register,
    formState: { isSubmitting, isDirty },
  } = useForm<Category>(props);
  console.log(isSubmitting, isDirty);
  const onSubmit: SubmitHandler<Category> = (data) => {
    console.log(data);
  };
  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <fieldset disabled={isSubmitting}>
        <label>
          <span>Name</span>
          <input
            className={input()}
            placeholder="Name"
            type="text"
            {...register("name")}
          />
        </label>
      </fieldset>

      <motion.div
        className="overflow-hidden text-right"
        animate={{ height: isDirty ? "auto" : 0 }}
        initial={{ height: 0 }}
      >
        <Button type="submit" isDisabled={isSubmitting || !isDirty}>
          Save
        </Button>
      </motion.div>
    </form>
  );
}
