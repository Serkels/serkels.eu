"use client";

import { Button } from "@1/ui/components/ButtonV";
import { useEffect } from "react";
import { NotFoundMain } from "~/app/not-found";

//

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="col-span-full md:col-span-6 md:-ml-[20px] xl:col-span-6">
      <NotFoundMain>
        40X
        <br />
        <Button
          intent="danger"
          size="lg"
          state="outline"
          onPress={() => reset()}
        >
          Try again
        </Button>
      </NotFoundMain>
    </div>
  );
}
