"use client";

import { TRPC_React } from ":trpc/client";
import { useSession } from "@1.modules/auth.next/react";
import type { Category } from "@1.modules/category.domain";
import { CreateQuestionForm } from "@1.modules/forum.ui/CreateCard/Form";
import { Idle } from "@1.modules/forum.ui/CreateCard/Idle";
import type { AuthProfile } from "@1.modules/profile.domain";
import { Avatar } from "@1.modules/profile.ui/avatar";
import { Card } from "@1.ui/react/card";
import { ErrorOccur } from "@1.ui/react/error";
import { Spinner } from "@1.ui/react/spinner";
import { useToggle } from "@react-hookz/web";
import { useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { P, match } from "ts-pattern";

//

export default function Create() {
  const { data: categories } = TRPC_React.category.forum.useQuery();

  const search_params = useSearchParams() ?? new URLSearchParams();
  const { id: category } =
    (categories ?? []).find(
      ({ slug }) => search_params.get("category") === slug,
    ) ?? {};
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useToggle(false);

  if (!categories) return null;
  if (!session) return null;
  return match(isOpen)
    .with(true, () => (
      <Mutate_CreateQuestion
        initialValues={{ category }}
        categories={categories}
        profile={session.profile}
      />
    ))
    .with(false, () => <Idle profile={session.profile} onClick={setIsOpen} />)
    .exhaustive();
}

function Mutate_CreateQuestion({
  categories,
  initialValues,
  profile,
}: {
  categories: Category[];
  initialValues?: { title?: string; category?: string };
  profile: AuthProfile;
}) {
  const create_info = TRPC_React.forum.question.create.useMutation();
  const utils = TRPC_React.useUtils();

  const invalidate = useCallback(
    () => Promise.all([utils.forum.question.find.invalidate()]),
    [utils],
  );

  return (
    <Card className="p-6">
      {match(create_info)
        .with({ status: "error", error: P.select() }, (error) => (
          <ErrorOccur error={new Error(error.message)} />
        ))
        .with({ status: "idle" }, () => (
          <div className="flex space-x-4">
            <Avatar className="h-10" profile={profile} />
            <CreateQuestionForm
              initialValues={initialValues}
              categories={categories}
              onSubmit={async (value) => {
                await create_info.mutateAsync(value);
                await invalidate();
              }}
            />
          </div>
        ))
        .with({ status: "loading" }, () => (
          <div className="flex justify-center">
            <Spinner className="mx-auto my-5" />
          </div>
        ))
        .with({ status: "success" }, () => {
          setTimeout(create_info.reset, 6666);
          return (
            <h1 className="py-3 text-center text-lg font-bold text-Chateau_Green">
              Question postée.
            </h1>
          );
        })
        .exhaustive()}
    </Card>
  );
}
