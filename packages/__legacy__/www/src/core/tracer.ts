import { startTransaction } from "@sentry/nextjs";

//
export function tracer(...args: Parameters<typeof startTransaction>) {
  const trace = startTransaction(...args);
  return {
    startChild: trace.startChild.bind(trace),
    [Symbol.dispose]() {
      trace.finish();
    },
  };
}
