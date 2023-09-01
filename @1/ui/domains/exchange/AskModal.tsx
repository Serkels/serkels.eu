import * as Formik from "formik";
import { useContext, type PropsWithChildren, type ReactNode } from "react";
import * as RA from "react-aria-components";
import { tv } from "tailwind-variants";

//

const dialog_class = tv({
  base: `
    boder-[#00000017]
    rounded-2xl
    border
    bg-white
    p-7
    text-black
    shadow-[10px_13px_24px_#00000033]
  `,
});
const overlay = tv({
  base: `
    fixed
    left-0
    top-0
    z-50
    flex
    h-[var(--visual-viewport-height)]
    w-screen
    items-center
    justify-center
    bg-slate-500/50
  `,
});

export const DialogTrigger = RA.DialogTrigger;
export function useDialogContext() {
  return useContext(RA.DialogContext) as RA.DialogProps;
}

export function Modal({ children }: PropsWithChildren) {
  return (
    <RA.ModalOverlay isDismissable={true} className={overlay()}>
      <RA.Modal>{children}</RA.Modal>
    </RA.ModalOverlay>
  );
}

export function Dialog({ children }: PropsWithChildren) {
  return (
    <RA.Dialog
      className={dialog_class({
        class: `
          flex
          min-h-[50vh]
          min-w-[75vw]
          flex-col
          items-stretch
          justify-between
          sm:min-w-[50vw]
          sm:max-w-[75vw]
          md:min-w-[25vw]
          md:max-w-[50vw]
          lg:max-w-[25vw]
        `,
      })}
    >
      {children}
    </RA.Dialog>
  );
}

export function Form({ children, ...props }: Formik.FormikFormProps) {
  return (
    <Formik.Form
      className={`
        space-y-7
      `}
      {...props}
    >
      {children}
    </Formik.Form>
  );
}

export function Textarea(props: Formik.FieldAttributes<unknown>) {
  return (
    <Formik.Field
      as="textarea"
      className=" block w-full rounded-2xl p-5 sm:text-sm"
      {...props}
    />
  );
}

export function ProposedByFigure({
  avatar,
  children,
  label,
}: PropsWithChildren<{ avatar: ReactNode; label: string }>) {
  return (
    <figure className="my-5 flex flex-row space-x-5">
      {avatar}
      <figcaption className="ml-2 mt-0.5">
        <span className="block text-sm font-light leading-snug text-gray-500 ">
          {label ?? "Proposé par :"}
        </span>
        <span className="block text-base font-medium leading-snug text-black">
          {children}
        </span>
      </figcaption>
    </figure>
  );
}

export function NotImplemented({ children }: PropsWithChildren) {
  return <div>{children}</div>;
}
