"use client";

import { Button } from "@1.ui/react/button";
// import { Formik } from "formik";
import { useSearchParams } from "next/navigation";
import type { ComponentPropsWithoutRef, PropsWithChildren } from "react";

export function SignInButton({ children }: PropsWithChildren) {
  return (
    <Button size="lg" className="min-w-44 mx-auto" type="submit">
      {children}
    </Button>
  );
}
export function EmailInput(props: ComponentPropsWithoutRef<"input">) {
  const searchParams = useSearchParams() ?? new URLSearchParams();
  const email = searchParams.get("email") ?? undefined;
  return <input {...props} value={email} readOnly={Boolean(email)} />;
}
