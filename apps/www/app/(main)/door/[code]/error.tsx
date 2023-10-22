"use client";

import { Error_Layout } from ":components/Error_Layout";
import { Button } from "@1.ui/react/button";
import { ErrorOccur } from "@1.ui/react/error";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <Error_Layout>
      <ErrorOccur error={error} />
      <Button onPress={() => reset()}>Toquer de nouveau</Button>
    </Error_Layout>
  );
}
