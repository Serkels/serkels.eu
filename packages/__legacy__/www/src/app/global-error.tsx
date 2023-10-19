"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  console.error(error);
  return (
    <html>
      <body>
        <h2>Something went wrong! src/app/global-error.tsx</h2>
        <button onClick={() => reset()}>Try again</button>
      </body>
    </html>
  );
}
