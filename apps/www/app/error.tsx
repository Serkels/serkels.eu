"use client";

import { Button } from "@1.ui/react/button";
import { ErrorOccur } from "@1.ui/react/error";
import { useMountEffect } from "@react-hookz/web";
import { signOut } from "next-auth/react";
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
} from "react";
import { tv } from "tailwind-variants";
//

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useMountEffect(() => {
    signOut();
  });

  return (
    <Error_Layout>
      <ErrorOccur error={error} />
      <Button onPress={() => reset()}>Toquer de nouveau</Button>
    </Error_Layout>
  );
}

const style = tv({
  base:
    "col-span-full flex min-h-[100dvh] " +
    "flex-col items-center justify-center space-y-5 px-4 sm:col-span-6 xl:col-start-6",
});

//

export const Error_Layout = forwardRef<
  ElementRef<"div">,
  ComponentPropsWithoutRef<"div">
>(function Error_Page(props, forwardedRef) {
  const { className, children, ...other_props } = props;
  return (
    <div ref={forwardedRef} className={style()} {...other_props}>
      {children}
    </div>
  );
});

export const Error_Message = forwardRef<
  ElementRef<"div">,
  {
    error: Error;
    reset: () => void;
  }
>(function Error_Page({ error, reset }, forwardedRef) {
  useMountEffect(() => {
    signOut();
  });

  return (
    <>
      <ErrorOccur error={error} />
      <Button onPress={() => reset()}>Toquer de nouveau</Button>
    </>
  );
});
