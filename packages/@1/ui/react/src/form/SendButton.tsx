//

import { AnimatePresence, motion } from "motion/react";
import { match } from "ts-pattern";
import { Button, type ButtonProps } from "../button";
import { PaperPlane } from "../icons";
import { Spinner } from "../spinner";
import { VisuallyHidden } from "../visually_hidden";

//

export function SendButton({
  isDisabled,
  isSubmitting,
}: {
  isDisabled?: boolean;
  isSubmitting?: boolean;
}) {
  return (
    <span className="absolute inset-y-0 right-5 flex items-center pl-2">
      <AnimatePresence mode="wait">
        <motion.div
          animate={{ y: 0 }}
          exit={{}}
          initial={{ y: -5 }}
          key={isSubmitting ? "spinner" : "submit"}
        >
          {match({ isSubmitting })
            .with({ isSubmitting: true }, () => (
              <Spinner className="size-4 text-success" />
            ))
            .otherwise(() => (
              <SubmitButton isDisabled={isDisabled} />
            ))}
        </motion.div>
      </AnimatePresence>
    </span>
  );
}

//

function SubmitButton(props: ButtonProps) {
  return (
    <Button
      aria-label="Send"
      className="focus:shadow-outline p-1 focus:outline-none"
      intent="light"
      type="submit"
      {...props}
    >
      <VisuallyHidden>Envoyer</VisuallyHidden>
      <PaperPlane className="h-6 w-6 text-success" />
    </Button>
  );
}
