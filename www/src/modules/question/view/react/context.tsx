//

import { ViewModelError } from "@1/core";
import {
  createContext,
  useContext,
  useMemo,
  type PropsWithChildren,
} from "react";
import { useQuestion_repository } from "../..";
import { Question_Controller } from "./controller";

//

const context = createContext<Question_Controller | null>(null);

export const QuestionControllerProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const questionRepository = useQuestion_repository();
  const questionViewModel = useMemo(
    () => new Question_Controller(questionRepository),
    [questionRepository],
  );

  return (
    <context.Provider value={questionViewModel}>{children}</context.Provider>
  );
};

export const useQuestion_controller = () => {
  const viewModel = useContext(context);
  if (!viewModel) throw new ViewModelError("No Question provided");
  return viewModel;
};
