//

import { get_trpc } from ":trpc/server";
import { Hydrate, dehydrate } from "@tanstack/react-query";
import { Suspense } from "react";
import { Exchange_List } from "./page.client";

//

export default async function Outlet(props: any) {
  const trpc = await get_trpc();
  await trpc.profile.me.prefetch();

  const dehydratedState = dehydrate(trpc.queryClient);

  return (
    <Hydrate state={dehydratedState}>
      <Page {...props} />
    </Hydrate>
  );
}

export async function Page() {
  return (
    <main className="col-span-full my-10 md:col-span-6 xl:col-span-6 ">
      <Suspense>
        <Exchange_List />
      </Suspense>
    </main>
  );
}

// @NextTsyringe.module({
//   parent: Root_Module,
// })

// export class TRPCLayout {
//   static TRPCLayout_Provider =
//   static Provider = async (
//     props: PropsWithChildren<{ params: Record<string, string> }>) => {
//     const { children, params } = props;
//     const dehydratedState = dehydrate(trpc.queryClient);
//     return <Hydrate state={dehydratedState}>
//       <ProviderComponent {...props}> {children} </ProviderComponent>
//     </Hydrate>;
//   };

//   static async register() {
//   }
// }

// function _module() {

// }

// interface MyType {
//   instanceMethod(): void;
// }

// interface ModuleRegistery {
//   // new():MyType;
//   register(): Promise<Registration[]>;
// }

// function staticImplements<T extends ModuleRegistery>() {
//   return <U extends T>(constructor: U) => {constructor};
// }

// @staticImplements()
// export class Exchange_PageModule  {
//   static log = debug("~:app/(index)/(main)/exchange/page.tsx");
//   static Page = Exchange_Page;
//   static async register() {
//     const trpc = await get_trpc();
//     console.log("Exchange_Module register");
//     return [];
//   }
//   static staticMethod() {}
//   // instanceMethod() {}
// }

// export default Exchange_PageModule.Page

// export function Exchange_Page() {
//   return  <Categorie />
// }
