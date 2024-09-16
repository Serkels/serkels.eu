//

import { AvatarMedia } from "@1.ui/react/avatar";
import { Approved, Circle, ExclamationMark, School } from "@1.ui/react/icons";
import { ActionItem, Menu } from "@1.ui/react/menu";
import { TimeInfo } from "@1.ui/react/time";
import type { PropsWithChildren } from "react";
import { createSlot } from "react-slotify";
import { tv } from "tailwind-variants";
import { useQuestion } from "./context";

//

export function Header({ children }: PropsWithChildren) {
  const question = useQuestion();
  const { owner: student } = question;
  const { profile, university } = student;
  return (
    <header className="mb-4 flex justify-between">
      <Header.Avatar.Renderer childs={children}>
        <AvatarMedia name={profile.name} image={profile.image}>
          <AvatarMedia.SubTitle>
            <School className="mr-1.5 inline-block w-6" />
            <span>{university}</span>
          </AvatarMedia.SubTitle>
        </AvatarMedia>
      </Header.Avatar.Renderer>
      <div className="flex flex-col">
        <div className="self-end">
          <ActionGroup>{children}</ActionGroup>
        </div>
        <div className="flex items-start space-x-2">
          <StateIndicator />
          <TimeInfo timestamps={question} />
        </div>
      </div>
    </header>
  );
}
Header.Avatar = createSlot();
Header.ActionGroup = ActionGroup;

function ActionGroup({ children }: PropsWithChildren) {
  const { id, title } = useQuestion();
  const href_searhparams = new URLSearchParams({ q: title });
  const href = `/forum?${href_searhparams}#${id}`;

  return (
    <Menu>
      <ActionItem
        className="flex items-center space-x-1 whitespace-nowrap"
        href={`/@~/report?${new URLSearchParams({ url: href })}`}
      >
        <ExclamationMark className="size-4" />
        <span>Signaler cette question</span>
      </ActionItem>
      <ActionGroup.DeleteAction.Renderer
        childs={children}
      ></ActionGroup.DeleteAction.Renderer>
    </Menu>
  );
}
ActionGroup.DeleteAction = createSlot();

const state_indicator = tv({
  base: "inline-block h-4",
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
