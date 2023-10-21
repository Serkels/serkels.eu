"use client";

import { Button } from "@1.ui/react/button";
import { Field, Form, Formik } from "formik";
import type { ComponentPropsWithoutRef } from "react";
// import { SelectCategoryField } from "~/components/SelectCategoryField";
// import { Avatar } from "~/components/Avatar";
// import { ErrorOccur } from "~/components/ErrorOccur";
// import { Question_Controller } from "~/modules/question/view/react/controller";
// import { QACardFormBody } from "./components/QAForm/QACardFormBody";

//

export function CreateQuestionForm({
  initialValues = {},
  onSubmit,
}: {
  initialValues?: { title?: string; category?: string };
  onSubmit: (values: { title: string; category: string }) => void;
}) {
  return (
    <Formik
      initialValues={{
        title: initialValues.title ?? "",
        category: initialValues.category ?? "",
      }}
      enableReinitialize
      onSubmit={onSubmit}
    >
      {({ isSubmitting }) => (
        <Form className="flex-1">
          <Field
            className="
          mb-7
          w-full
          rounded-sm border border-solid border-[#dddddd]
          px-4 py-3

          placeholder-black

          md:col-span-6
        "
            disabled={isSubmitting}
            name="title"
            placeholder="Pose une questions aux étudiants ..."
            required
          />
          <div className="flex justify-between">
            <SelectCategoryField
              type="question"
              className="min-w-[25%] border border-[#dddddd]"
              disabled={isSubmitting}
              // placeholder=""
              name="category"
              required
            />

            <Button
              type="submit"
              intent="primary"
              isDisabled={isSubmitting}
              className="max-w-fit"
            >
              Envoyer
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

function SelectCategoryField({}: ComponentPropsWithoutRef<"select"> & {
  type: string;
}) {
  return <select name="" id=""></select>;
}
// export function Form({
//   info,
//   profile,
// }: {
//   info: UseMutationResult<{}, Error>;
//   profile: Profile;
// }) {
//   return <>form</>;
// export function Form({
//   info,
//   profile,
// }: {
//   info: UseMutationResult<{}, Error>;
//   profile: Profile;
// }) {
//   return <>form</>;
// const { mutateAsync, status, error, reset } =info;

// const [isOpen, setIsOpen] = useState(false);

// return match(status)
//   .with("error", () => (
//     <Card>
//       <ErrorOccur error={error as Error} />
//     </Card>
//   ))
//   .with("idle", () => (
//     <Card>
//       <AvatarProfile className="h-10" profile={} />
//       {isOpen ? (
//         <Suspense>
//           <QACardFormBody onSubmit={(values) => mutateAsync(values)} />
//         </Suspense>
//       ) : (
//         <button
//           className="
//             w-full
//             rounded-sm border border-solid border-[#dddddd]
//             px-4 py-2
//             text-left
//             hover:bg-gray-200
//           "
//           onClick={() => setIsOpen(true)}
//         >
//           Posez une questions aux étudiants...
//         </button>
//       )}
//     </Card>
//   ))
//   .with("loading", () => (
//     <Card>
//       <Spinner className="mx-auto my-5" />
//     </Card>
//   ))
//   .with("success", () => {
//     setTimeout(reset, 3_333);
//     return (
//       <Card>
//         <h1 className="flex-1 py-3 text-center text-lg font-bold text-Chateau_Green">
//           Question postée
//         </h1>
//       </Card>
//     );
//   })
//   .exhaustive();
// }
