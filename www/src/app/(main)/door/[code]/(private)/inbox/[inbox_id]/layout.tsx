//

import type { PropsWithChildren } from "react";
import Nest from "react-nest";
import { Inbox_Provider, Thread_Provider } from "./page.client";

//

export default function Layout({ children }: PropsWithChildren) {
  return (
    <Nest>
      <Inbox_Provider />
      <Thread_Provider />
      {children}
    </Nest>
  );
}
