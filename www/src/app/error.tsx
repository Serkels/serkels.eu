"use client";

import { Button } from "@1/ui/components/ButtonV";
import tw from "tailwind-styled-components";
import { ErrorOccur } from "~/components/ErrorOccur";

//

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  console.log(error);
  return (
    <Container>
      <ErrorOccur error={error} />
      <Button onPress={() => reset()}>Toquer de nouveau</Button>
    </Container>
  );
}

const Container = tw.div`
  col-span-full
  flex
  min-h-[100dvh]
  flex-col
  items-center
  justify-center
  space-y-5
  px-4
  sm:col-span-6
  xl:col-start-6
`;
