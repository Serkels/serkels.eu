//

import { match } from "ts-pattern";
import { useQuestion } from "./context";

//

export function ResponseCount() {
  const question = useQuestion();
  return (
    <p className="flex items-center space-x-1 text-sm font-bold text-Dove_Gray">
      {match(question)
        .with({ answers: [] }, () => (
          <>
            <span className="text-danger">0</span> <span>réponse</span>
          </>
        ))
        .otherwise(({ answers }) => (
          <>
            <span className="text-success">{answers.length}</span>
            <span>réponse{answers.length > 1 ? "s" : ""}</span>
          </>
        ))}
    </p>
  );
}
