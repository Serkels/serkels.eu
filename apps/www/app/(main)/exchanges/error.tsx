"use client";

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
    <div className="flex min-h-[50vh] flex-col items-center justify-center space-y-5">
      <ErrorOccur error={error} />
      <Button onPress={() => reset()}>Toquer de nouveau</Button>
    </div>
  );
}
