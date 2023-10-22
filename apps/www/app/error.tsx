"use client";

import { Error_Layout } from ":components/Error_Layout";
import { Button } from "@1.ui/react/button";
import { ErrorOccur } from "@1.ui/react/error";

//

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  // useMountEffect(() => {
  //   signOut();
  // });

  return (
    <Error_Layout className="min-h-[100dvh]">
      <ErrorOccur error={error} />
      <Button onPress={() => reset()}>Toquer de nouveau</Button>
    </Error_Layout>
  );
}
