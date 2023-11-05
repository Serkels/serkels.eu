//

import type { Question } from "@1.modules/forum.domain";
import { type PropsWithChildren } from "react";
import { createSlot } from "react-slotify";
import { tv } from "tailwind-variants";
import { match } from "ts-pattern";
import { Body } from "./Body";
import { Header } from "./Header";
import { Provider, useAwnsersOutletState } from "./context";

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
        <Responses>
          <Question_Card.Responses.Renderer childs={children} />
        </Responses>
        <hr className="my-2" />
        <Question_Card.Footer.Renderer childs={children} />
      </div>
    </Provider>
  );
}

Question_Card.Footer = createSlot();
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
