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
  console.log("(main)/(about)/status/error");
  console.error(error);
  console.trace();
  return (
    <div>
      <ErrorOccur error={error} />
      <Button onPress={() => reset()}>Toquer de nouveau</Button>
    </div>
  );
}
