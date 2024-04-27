//

import type { Inbox } from "@1.modules/inbox.domain";
import type { UseQueryResult } from "@tanstack/react-query";
import ContentLoader from "react-content-loader";
import { P, match } from "ts-pattern";

export function Thread_AsyncItem({
  info,
  children,
}: {
  info: UseQueryResult<Inbox>;
  children: (props: { inbox: Inbox }) => React.ReactNode;
}) {
  return match(info)
    .with({ status: "error" }, ({ error }) => {
      throw error;
    })
    .with({ status: "loading" }, () => <Loader />)
    .with({ status: "success", data: P.select() }, (inbox) =>
      children({ inbox }),
    )
    .exhaustive();
}
export function Loader() {
  return (
    <ContentLoader
      speed={2}
      width={400}
      height={44}
      viewBox="0 0 400 44"
      backgroundColor="#f5f8fa"
      foregroundColor="#ecebeb"
    >
      <rect x="48" y="8" rx="3" ry="3" width="88" height="6" />
      <rect x="48" y="26" rx="3" ry="3" width="52" height="6" />
      <circle cx="20" cy="20" r="20" />
    </ContentLoader>
  );
}
