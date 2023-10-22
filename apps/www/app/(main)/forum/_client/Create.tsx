"use client";

import { TRPC_React } from ":trpc/client";
import { CreateQuestionForm } from "@1.modules/forum.ui/CreateCard/Form";
import { Idle } from "@1.modules/forum.ui/CreateCard/Idle";
import type { Profile } from "@1.modules/profile.domain";
import { Avatar } from "@1.modules/profile.ui/avatar";
import { Card } from "@1.ui/react/card";
import { ErrorOccur } from "@1.ui/react/error";
import { Spinner } from "@1.ui/react/spinner";
import { useToggle } from "@react-hookz/web";
import { useSession } from "next-auth/react";
import { P, match } from "ts-pattern";

//

export default function Create() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useToggle(false);

  if (!session) return null;
  return match(isOpen)
    .with(true, () => <CreateFrom profile={session.profile} />)
    .with(false, () => <Idle profile={session.profile} onClick={setIsOpen} />)
    .exhaustive();
}

function CreateFrom({ profile }: { profile: Profile }) {
  const create_info = TRPC_React.forum.question.create.useMutation();
  return match(create_info)
    .with({ status: "error", error: P.select() }, (error) => (
      <Card>
        <ErrorOccur error={new Error(error.message)} />
      </Card>
    ))
    .with({ status: "idle" }, () => (
      <Card>
        <Avatar className="h-10" profile={profile} />
        <CreateQuestionForm onSubmit={(value) => create_info.mutate(value)} />
      </Card>
    ))
    .with({ status: "loading" }, () => (
      <Card>
        <Spinner className="mx-auto my-5" />
      </Card>
    ))
    .with({ status: "success" }, () => {
      setTimeout(create_info.reset, 3_333);
      return (
        <Card>
          <h1 className="flex-1 py-3 text-center text-lg font-bold text-Chateau_Green">
            Question postée
          </h1>
        </Card>
      );
    })
    .exhaustive();
}
