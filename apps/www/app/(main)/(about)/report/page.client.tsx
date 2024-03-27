"use client";

import { input } from "@1.ui/react/form/atom";
import { useFormState } from "react-dom";
import { tv } from "tailwind-variants";
import { report } from "./action";

const initialState = {
  message: "",
};

export function ReportForm() {
  const { form, label, input } = style();
  const [state, formAction] = useFormState(report, initialState);
  console.log({ state });
  return (
    <form action={formAction} className={form()}>
      <label className={label()}>
        <div className="flex-1">Email</div>
        <div className="flex w-fit flex-grow flex-col">
          <input
            className={input()}
            type="text"
            id="email"
            name="email"
            required
          />
          {state.errors?.email ? (
            <div className="text-danger">{state.errors.email.join("\n")}</div>
          ) : (
            <></>
          )}
        </div>
      </label>

      <p aria-live="polite" className="sr-only">
        {state?.message}
      </p>
      <button>Sign up</button>
    </form>
  );
}

//

const style = tv({
  base: "",
  slots: {
    form: "grid grid-cols-2 justify-center space-y-10",
    label: "col-span-full flex space-x-1",
    input: input({ className: "w-full" }),
  },
});
