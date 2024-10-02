"use client";

import { useMountEffect } from "@react-hookz/web";

//

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useMountEffect(() => {
    console.error(error);
  });
  return <button onClick={reset}>🟥</button>;
}
