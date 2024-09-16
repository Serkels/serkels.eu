//

import type { Answer } from "@1.modules/forum.domain";
import { StudentAvatarMedia } from "@1.modules/profile.ui/avatar";
import { Approved, ExclamationMark } from "@1.ui/react/icons";
import { ActionItem, Menu } from "@1.ui/react/menu";
import { TimeInfo } from "@1.ui/react/time";
import { type PropsWithChildren } from "react";
import { createSlot } from "react-slotify";
import { useQuestion } from "../QuestionCard/context";
import { Provider, useAnswer } from "./context";

//

export function Answer_Card<T extends Answer>(
  props: PropsWithChildren<{ answer: T }>,
) {
  const { children, answer } = props;
  const { content, owner: student } = answer;
  return (
    <Provider answer={answer}>
      <div
        className={
          answer.accepted_for ? `rounded-xl border bg-success/5 p-6 px-6` : ""
        }
        id={answer.id}
      >
        <header className="flex justify-between">
          <Answer_Card.Avatar.Renderer childs={children}>
            <StudentAvatarMedia student={student} />
          </Answer_Card.Avatar.Renderer>
          <div className="flex flex-col items-end">
            <MenuAction>{children}</MenuAction>
            <TimeInfo timestamps={answer} />
          </div>
        </header>
        <article className="my-3 ml-12 break-words">{content}</article>
        <Answer_Card.Footer.Renderer childs={children} />
      </div>
    </Provider>
  );
}

Answer_Card.Footer = createSlot();
Answer_Card.Avatar = createSlot();
Answer_Card.Indicator = Answer_Indicator;
Answer_Card.Provider = Provider;
Answer_Card.MenuAction = MenuAction;

//

function MenuAction({ children }: PropsWithChildren) {
  const answer = useAnswer();
  const { title } = useQuestion();
  const href_searchparams = new URLSearchParams({ q: title });
  const href = `/forum?${href_searchparams}#${answer.id}`;

  return (
    <Menu>
      <MenuAction.DeleteAction.Renderer
        childs={children}
      ></MenuAction.DeleteAction.Renderer>
      <ActionItem
        className="flex items-center space-x-1 whitespace-nowrap"
        href={`/@~/report?${new URLSearchParams({ url: href })}`}
      >
        <ExclamationMark className="h-4" /> <span>Signaler cette réponse</span>
      </ActionItem>
    </Menu>
  );
}
MenuAction.DeleteAction = createSlot();
function Answer_Indicator() {
  const answer = useAnswer();
  const question = useQuestion();
  if (!answer.accepted_for) return null;
  return (
    <div className="ml-12 flex justify-between">
      <p className="text-bold text-xs text-success">
        Approuvé par {question.owner.profile.name}
      </p>
      <Approved />
    </div>
  );
}
