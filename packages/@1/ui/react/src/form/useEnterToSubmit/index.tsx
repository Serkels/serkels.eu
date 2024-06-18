//

import {
  useKeyboardEvent,
  useThrottledCallback,
  useToggle,
} from "@react-hookz/web";

//

export function useEnterToSubmit({
  is_submitting,
  on_submit,
  throttled_delay = 1_000,
}: {
  is_submitting: boolean;
  on_submit: () => void;
  throttled_delay?: number;
}) {
  const [can_submit_with_enter, set_can_submit_with_enter] = useToggle(true);

  const throttled_on_submit = useThrottledCallback(
    on_submit,
    [],
    throttled_delay,
  );

  useKeyboardEvent(
    "Enter",
    () => {
      if (!can_submit_with_enter) return;
      if (is_submitting) return;
      throttled_on_submit();
    },
    [can_submit_with_enter, is_submitting],
  );
  useKeyboardEvent("Shift", () => set_can_submit_with_enter(), [], {
    event: "keyup",
  });
  useKeyboardEvent("Shift", () => set_can_submit_with_enter(), [], {
    event: "keydown",
  });
}
