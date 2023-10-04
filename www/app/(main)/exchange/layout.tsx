//

import { type PropsWithChildren } from "react";

//

export default async function Layout({
  children,
  filter,
  see_also,
}: PropsWithChildren<{ filter: React.ReactNode; see_also: React.ReactNode }>) {
  return (
    <>
      {filter}
      {children}
      {see_also}
    </>
  );
}
