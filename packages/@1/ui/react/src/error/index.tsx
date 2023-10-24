//

export function ErrorOccur({
  error,
  code,
  debug,
}: {
  error: Error;
  code?: string;
  debug?: boolean;
}) {
  return (
    <section className="flex flex-col items-center justify-center space-x-3 text-center ">
      <h1 className="text-xlg mx-auto my-0 py-3 text-center text-6xl font-extrabold text-primary invert sm:text-7xl lg:text-8xl">
        {code}
      </h1>

      <h5 className="text-black-500 py-3 text-center text-lg font-bold">
        Une erreur est survenu...
        <br />
        {debug ? (
          <code className="text-primary invert">{error?.message}</code>
        ) : null}
      </h5>

      <br />

      <p className="text-xs">
        Si cette erreur semble irésolvable, fermer cette fenêtre et réessayez de
        vous authentifier.
      </p>

      <br />
    </section>
  );
}
