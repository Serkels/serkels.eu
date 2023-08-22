//

import { ViewModelError } from "@1/core";
import { useCoreContext } from "~/core/react";
import { Question_Repository } from "./repository";

//

export function useQuestion_repository() {
  const { repositories } = useCoreContext();
  const repository = repositories.get(Question_Repository);
  if (!repository) throw new ViewModelError("No Question_Repository provided");
  return repository as Question_Repository;
}
