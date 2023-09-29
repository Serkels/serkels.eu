//

import type React from "react";
import type { PropsWithChildren } from "react";
import Nest from "react-nest";
import { Foo } from "./layout.client";

// @Reflect.metadata(
//   "registrations",
//   async ({ params }: { params: Record<string, string> }) => {
//     const seesion = await Promise.resolve("doudu");
//     console.log({ params });

//     return [
//       {
//         token: JWT_TOKEN,
//         useValue: seesion,
//       },
//     ];
//   },
// )
// @context_injection(Root_Module)
class Layout_Module {
  static async Layout({ children }: PropsWithChildren) {
    return <>{children}</>;
  }
}
export default Layout_Module.Layout;

export async function Layout({
  children,
  aside,
}: PropsWithChildren<{ aside: React.ReactNode }>) {
  return (
    <Nest>
      <Foo />
      <_layout />
    </Nest>
  );

  function _layout() {
    return (
      <>
        {children}
        {aside}
      </>
    );
  }
}
