//

export function QAFormErrorOccur({ error }: { error: Error }) {
  return (
    <h1 className="flex-1 py-3 text-center text-lg font-bold text-red-500">
      Une erreur est survenu...
      <br />
      Veuillez fermer cette fenêtre et réessayez de vous authentifier.
      <br />
      <code className="text-gray-800">{error?.message}</code>
    </h1>
  );
}
