"use client";

import { AppToastOptions } from ":components/toast";
import { create_report } from "@1.modules/profile.domain/report";
import { button } from "@1.ui/react/button/atom";
import { input } from "@1.ui/react/form/atom";
import { redirect, useSearchParams } from "next/navigation";
import {
  createContext,
  useContext,
  useState,
  type PropsWithChildren,
} from "react";
import { useFormState, useFormStatus } from "react-dom";
import { toast } from "react-toastify";
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
    category: "Arnaques ou fraude",
    email,
    link: `${window.location.origin}${url}`,
    success: false,
    errors: null,
    report_error: null,
  });

  return (
    <form action={formAction} className={form()}>
      <Fieldset>
        <input
          type="hidden"
          name={create_report.keyof().Enum.email}
          readOnly
          value={state.email}
        />

        <div className="space-y-2">
          <b
            title="Cliquez sur l’option qui décrit le mieux en quoi ce contenu enfreint
            nos règles de la communauté :"
          >
            En quoi ce contenu enfreint nos règles de la communauté :
          </b>
          <div className="ml-4">
            {Object.values(create_report.shape.category.Enum).map(
              (category) => (
                <label className="flex space-x-2" key={category}>
                  <input
                    type="radio"
                    key={category}
                    className={input({ className: "max-w-fit" })}
                    name={create_report.keyof().Enum.category}
                    value={category}
                  />
                  <span>{category}</span>
                </label>
              ),
            )}

            {state.errors?.category ? (
              <div className="text-danger">
                {state.errors.category.join("\n")}
              </div>
            ) : null}
          </div>
        </div>

        <label className="grid grid-cols-5 items-center">
          <b className="col-span-1">Context</b>
          <div className="col-span-4">
            <input
              className={input({ className: "opacity-50" })}
              type="text"
              name={create_report.keyof().Enum.link}
              readOnly
              value={state.link}
            />
            {state.errors?.link ? (
              <div className="text-danger">{state.errors.link.join("\n")}</div>
            ) : null}
          </div>
        </label>

        <label className="grid grid-cols-5 items-center">
          <b className="col-span-1">Commentaire</b>
          <div className="col-span-4">
            <Comment />
            {state.errors?.comment ? (
              <div className="text-danger">
                {state.errors.comment.join("\n")}
              </div>
            ) : null}
          </div>
        </label>

        <label className="grid grid-cols-5 items-center">
          <b className="col-span-1">Capture d'écran</b>
          <div className="col-span-4">
            <input
              className={input()}
              type="file"
              name={create_report.keyof().Enum.attachments}
            />
            {state.errors?.attachments ? (
              <div className="text-danger">
                {state.errors.attachments.join("\n")}
              </div>
            ) : null}
          </div>
        </label>

        {state.report_error
          ? toast.error(
              <>
                Une erreur s'est produite lors du signalement, veuillez
                réessayer : "
                <div className="text-danger">{state.report_error}</div>"
              </>,
              AppToastOptions,
            )
          : null}

        {state.success
          ? toast.success(
              <div className="text-success">
                Le contenu à été signalé à l'équipe de modération
              </div>,
              AppToastOptions,
            )
          : null}

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

function Comment() {
  const [char_count, set_char_count] = useState(0);
  return (
    <>
      <textarea
        className={input({ wrong_value: char_count > 500 })}
        name={create_report.keyof().Enum.comment}
        onChange={(e) => set_char_count(e.target.value.length)}
      />
      <p className="float-right text-xs">
        {char_count === 0 ? (
          <>(e.g. 500 caractères)</>
        ) : (
          <span className={char_count > 500 ? "font-bold text-danger" : ""}>
            {char_count} / 500
          </span>
        )}
      </p>
    </>
  );
}

function Fieldset({ children }: PropsWithChildren) {
  const { pending } = useFormStatus();
  return (
    <fieldset className="space-y-4" disabled={pending}>
      {children}
    </fieldset>
  );
}

const style = tv({
  base: "",
  slots: {
    form: "justify-center space-y-10",
    label: "grid grid-cols-3 space-x-1",
    input: input({ className: "w-full" }),
  },
});
