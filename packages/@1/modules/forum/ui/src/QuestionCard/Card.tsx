//

import type { Question } from "@1.modules/forum.domain";
import { type PropsWithChildren } from "react";
import { createSlot } from "react-slotify";
import { tv } from "tailwind-variants";
import { match } from "ts-pattern";
import { Body } from "./Body";
import { Header } from "./Header";
import {
  Provider,
  useAwnsersOutletState,
  useNewOutletState,
  useQuestion,
} from "./context";

//

export function Question_Card<T extends Question>(
  props: PropsWithChildren<{ question: T }>,
) {
  const { children, question } = props;
  return (
    <Provider question={question}>
      <div
        className={`
          rounded-xl
          border
          border-[#00000017]
          bg-white
          p-6
          text-black shadow-[5px_5px_10px_#7E7E7E33]
        `}
        id={question.id}
      >
        <Header />
        <Body />
        <Approved_Responses>
          <Question_Card.Approved_Response.Renderer childs={children} />
        </Approved_Responses>
        <Responses>
          <Question_Card.Responses.Renderer childs={children} />
        </Responses>
        <NewAnswer>
          <Question_Card.NewAnswer.Renderer childs={children} />
        </NewAnswer>
        <hr className="my-2" />
        <Question_Card.Footer.Renderer childs={children} />
      </div>
    </Provider>
  );
}

Question_Card.Approved_Response = createSlot();
Question_Card.Footer = createSlot();
Question_Card.NewAnswer = createSlot();
Question_Card.Responses = createSlot();

export const card = tv({
  base: "",
});

//

function Responses({ children }: PropsWithChildren) {
  const [outlet] = useAwnsersOutletState();
  return match(outlet)
    .with({ state: "hidden" }, () => null)
    .with({ state: "idle" }, () => <>{children}</>)
    .otherwise(() => null);
}

function Approved_Responses({ children }: PropsWithChildren) {
  const question = useQuestion();
  if (!question.accepted_answer) return null;
  return <>{children}</>;
}

function NewAnswer({ children }: PropsWithChildren) {
  const [new_outlet] = useNewOutletState();
  if (new_outlet.state === "hidden") return null;
  return <>{children}</>;
}
