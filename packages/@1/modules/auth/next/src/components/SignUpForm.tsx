"use client";

import { PROFILE_ROLES } from "@1.modules/profile.domain";
import { Button } from "@1.ui/react/button";
import { input } from "@1.ui/react/form/atom";
import { UserAvatarFilled } from "@1.ui/react/icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { tv } from "tailwind-variants";
import type { inferServerActionError } from "zsa";
import { useServerAction } from "zsa-react";
import { signup_form_schema, type SignupForm } from "../schema/signup";
import { signup_action } from "./signup.action";

//

export const useSignUpFormContext = useFormContext<SignupForm>;
export function SignUpForm() {
  const { base } = style();
  const { isPending, isSuccess, execute, error } =
    useServerAction(signup_action);
  const router = useRouter();
  const form = useForm({
    defaultValues: {
      confirm_password: "",
      email: "",
      password: "",
      role: PROFILE_ROLES.enum.STUDENT,
    },
    resolver: zodResolver(signup_form_schema),
  });

  async function on_submit(values: SignupForm) {
    const [, err] = await execute(values);
    if (err) return;
    router.push(`/signup/verifing`);
  }

  return (
    <FormProvider {...form}>
      <form className={base()} onSubmit={form.handleSubmit(on_submit)}>
        <input
          {...form.register("role")}
          type="hidden"
          defaultValue={PROFILE_ROLES.enum.STUDENT}
        />

        <div className="mx-auto">
          <UserAvatarFilled className="h-14 w-14 text-gray-400" />
        </div>

        <div className="container mx-auto grid grid-cols-12 gap-5 xl:max-w-4xl">
          <Email_Field />
          <Password_Field />
          <ConfirmPassword_Field />
        </div>
        <Button
          size="lg"
          className="mx-auto min-w-44"
          type="submit"
          isDisabled={isPending || isSuccess}
        >
          Terminer
        </Button>
      </form>
      <ErrorBlock error={error} />
    </FormProvider>
  );
}

function Email_Field() {
  const {
    register,
    formState: { errors, isSubmitting, isLoading },
  } = useFormContext<SignupForm>();

  return (
    <label className="col-span-full">
      <span className="text-Silver_Chalice">Email</span>

      <input
        {...register("email")}
        className={input()}
        placeholder="Email"
        disabled={isSubmitting || isLoading}
        required
        type="email"
      />
      {errors.email && (
        <div className="text-danger">{errors.email.message}</div>
      )}
    </label>
  );
}

function Password_Field() {
  const {
    formState: { errors },
  } = useFormContext<SignupForm>();

  return (
    <label className="col-span-full">
      <span className="text-Silver_Chalice">Mot de passe</span>

      {errors.password && (
        <div className="text-danger">{errors.password.message}</div>
      )}
    </label>
  );
}

function ConfirmPassword_Field() {
  const {
    formState: { errors },
  } = useFormContext<SignupForm>();

  return (
    <label className="col-span-full">
      <span className="text-Silver_Chalice">Mot de passe</span>

      {errors.confirm_password && (
        <div className="text-danger">{errors.confirm_password.message}</div>
      )}
    </label>
  );
}

function ErrorBlock({
  error,
}: {
  error?: inferServerActionError<typeof signup_action> | undefined;
}) {
  if (!error) return null;
  console.log({ error });
  return <div className="bg-danger m-6 p-6 text-white">{error.message}</div>;
}

const style = tv({
  base: "flex flex-col justify-center space-y-10",
  slots: {
    label: "col-span-full flex items-center space-x-1",
  },
});
