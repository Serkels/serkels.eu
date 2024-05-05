import { useQuestion } from "./context";

export function Body() {
  const question = useQuestion();
  return (
    <article>
      <h3 className="my-5 break-words text-xl font-bold">{question.title}</h3>
    </article>
  );
}
