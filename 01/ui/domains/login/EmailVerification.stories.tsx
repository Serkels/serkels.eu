//
import type { Story } from "@ladle/react";
import type { ComponentProps } from "react";
import { EmailVerification } from "./EmailVerification";

export const Simple: Story<ComponentProps<typeof EmailVerification>> = ({
  email,
  onUndo,
}) => <EmailVerification email={email} onUndo={onUndo} />;
