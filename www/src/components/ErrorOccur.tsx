//

export function ErrorOccur({ error }: { error: Error }) {
  return (
    <section className="flex flex-col items-center justify-center space-x-3">
      <h1 className="text-black-500 py-3 text-center text-lg font-bold">
        Une erreur est survenu...
        <br />
        <code className="text-gray-800">{error?.message}</code>
      </h1>

      <p className="text-xs">
        Si cette erreur semble irésolvable, fermer cette fenêtre et réessayez de
        vous authentifier.
      </p>
    </section>
  );
}
