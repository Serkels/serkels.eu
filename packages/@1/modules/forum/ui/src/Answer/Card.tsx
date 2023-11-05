//

import type { Answer } from "@1.modules/forum.domain";
import { StudientAvatarMedia } from "@1.modules/profile.ui/avatar";
import { type PropsWithChildren } from "react";
import { Provider } from "./context";

//

export function Answer_Card<T extends Answer>(
  props: PropsWithChildren<{ answer: T }>,
) {
  const { children, answer } = props;
  const { content, owner: studient } = answer;
  return (
    <Provider answer={answer}>
      <div  className={``}
        id={answer.id}
      >
        <header className=" flex justify-between">
          <StudientAvatarMedia studient={studient} />
        </header>
        <article className="my-3 ml-12">{content}</article>
        {children}
      </div>
    </Provider>
  );
}
