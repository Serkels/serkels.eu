//

import type { Answer } from "@1.modules/forum.domain";
import { StudientAvatarMedia } from "@1.modules/profile.ui/avatar";
import { Approved } from "@1.ui/react/icons";
import { type PropsWithChildren } from "react";
import { createSlot } from "react-slotify";
import { useQuestion } from "../QuestionCard/context";
import { Provider, useAnswer } from "./context";

//

export function Answer_Card<T extends Answer>(
  props: PropsWithChildren<{ answer: T }>,
) {
  const { children, answer } = props;
  const { content, owner: studient } = answer;
  return (
    <Provider answer={answer}>
      <div
        className={
          answer.accepted_for ? `rounded-xl border bg-success/5 p-6 px-6` : ""
        }
        id={answer.id}
      >
        <header className=" flex justify-between">
          <StudientAvatarMedia studient={studient} />
        </header>
        <article className="my-3 ml-12 break-words">{content}</article>
        <Answer_Card.Footer.Renderer childs={children} />
      </div>
    </Provider>
  );
}

Answer_Card.Provider = Provider;
Answer_Card.Footer = createSlot();
Answer_Card.Indicator = Answer_Indicator;

//

function Answer_Indicator() {
  const answer = useAnswer();
  const question = useQuestion();
  if (!answer.accepted_for) return null;
  return (
    <div className="ml-12 flex justify-between">
      <p className="text-bold text-xs text-success">
        Validé par {question.owner.profile.name}
      </p>
      <Approved />
    </div>
  );
}
