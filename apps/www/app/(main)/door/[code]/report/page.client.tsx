"use client";

import { create_report } from "@1.modules/profile.domain/report";
import { button } from "@1.ui/react/button/atom";
import { input } from "@1.ui/react/form/atom";
import Link from "next/link";
import { redirect, useSearchParams } from "next/navigation";
import { createContext, useContext, type PropsWithChildren } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { tv } from "tailwind-variants";
import { report } from "./action";

//

const context = createContext({ email: "" });

//

export function ReportForm() {
  const searchParams = useSearchParams();
  const url = searchParams.get("url");
  if (!url) return redirect("/");

  const { email } = ReportForm.useContext();
  const { form, input } = style();
  const [state, formAction] = useFormState(report, {
    email,
    link: `${window.location.origin}${url}`,
    sucess: false,
    errors: null,
    report_error: null,
  });

  if (state.sucess)
    return (
      <div>
        <p>
          Signalement envoyé.
          <br />
          Merci de votre confiance.
        </p>
      </div>
    );

  return (
    <form action={formAction} className={form()}>
      <Fieldset>
        <label className="grid grid-cols-5 items-center">
          <div className="col-span-1">Lien</div>
          <div className="col-span-4">
            <Link href={state.link}>
              <input
                className={input()}
                type="text"
                name={create_report.keyof().Enum.link}
                readOnly
                value={state.link}
              />
            </Link>
            {state.errors?.link ? (
              <div className="text-danger">{state.errors.link.join("\n")}</div>
            ) : null}
          </div>
        </label>

        <label className="grid grid-cols-5 items-center">
          <div className="col-span-1">Email</div>
          <div className="col-span-4">
            <input
              className={input()}
              type="text"
              name={create_report.keyof().Enum.email}
              readOnly
              value={state.email}
            />
            {state.errors?.email ? (
              <div className="text-danger">{state.errors.email.join("\n")}</div>
            ) : null}
          </div>
        </label>

        <label className="grid grid-cols-5 items-center">
          <div className="col-span-1">Commentaire</div>
          <div className="col-span-4">
            <textarea
              className={input()}
              name={create_report.keyof().Enum.comment}
            />
            {state.errors?.comment ? (
              <div className="text-danger">
                {state.errors.comment.join("\n")}
              </div>
            ) : null}
          </div>
        </label>

        {state.report_error ? (
          <div className="text-danger">{state.report_error}</div>
        ) : null}

        <button className={button({ intent: "danger" })}>Signaler</button>
      </Fieldset>
    </form>
  );
}

ReportForm.useContext = () => {
  return useContext(context);
};

export function ReportForm_Provider({
  children,
  value,
}: PropsWithChildren<{ value: { email: string } }>) {
  return <context.Provider value={value}>{children}</context.Provider>;
}

//

function Fieldset({ children }: PropsWithChildren) {
  const { pending, data, method, action } = useFormStatus();
  return <fieldset disabled={pending}>{children}</fieldset>;
}

const style = tv({
  base: "",
  slots: {
    form: "justify-center space-y-10",
    label: "grid grid-cols-3 space-x-1",
    input: input({ className: "w-full" }),
  },
});
