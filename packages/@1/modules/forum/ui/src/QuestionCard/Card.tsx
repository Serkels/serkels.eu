//

import type { Question } from "@1.modules/forum.domain";
import type { FC } from "react";
import { tv } from "tailwind-variants";
import { Body } from "./Body";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { Responses } from "./Responses";
import { Provider } from "./context";

//

export const Question_Card: FC<Question> = (props) => {
  const { id } = props;
  return (
    <Provider question={props}>
      <div
        className={`
          overflow-hidden
          rounded-xl
          border
          border-[#00000017]
          bg-white
          p-6
          text-black shadow-[5px_5px_10px_#7E7E7E33]
        `}
        id={id}
      >
        <Header />
        <Body />
        <Responses />
        <hr className="my-2" />
        <Footer />
      </div>
    </Provider>
  );
};

export const card = tv({
  base: "",
});
