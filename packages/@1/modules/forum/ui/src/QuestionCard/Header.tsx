//

import { AvatarMedia } from "@1.ui/react/avatar";
import { Approved, Circle, School } from "@1.ui/react/icons";
import { TimeInfo } from "@1.ui/react/time";
import { tv } from "tailwind-variants";
import { useQuestion } from "./context";

//

export function Header() {
  const question = useQuestion();
  const { owner: studient } = question;
  const { profile, university } = studient;
  return (
    <header className="mb-4 flex justify-between">
      <AvatarMedia name={profile.name} image={profile.image}>
        <AvatarMedia.SubTitle>
          <School className="mr-1.5 inline-block w-6" />
          <span>{university}</span>
        </AvatarMedia.SubTitle>
      </AvatarMedia>
      <div className="flex items-start space-x-2">
        <ActionGroup />
        <StateIndicator />
        <TimeInfo timestamps={question} />
      </div>
    </header>
  );
}

function ActionGroup() {
  return null;
}

const state_indicator = tv({
  base: "mt-3 inline-block h-4",
  variants: { is_accepted: { true: "text-success", false: "text-error" } },
});

function StateIndicator() {
  const question = useQuestion();
  const is_accepted = Boolean(question.accepted_answer);
  return question.accepted_answer ? (
    <Approved className={state_indicator({ is_accepted })} />
  ) : (
    <Circle className={state_indicator({ is_accepted })} />
  );
}
