"use client";

import { createStateContext } from "react-use";
import { Container_Provider } from "~/core/react";

//

const [useExchange_Route_Context, Exchange_Route_Provider] = createStateContext(
  { exchange_id: NaN },
);

export { Exchange_Route_Provider, useExchange_Route_Context };
// export function ContainerRegister_Provider<T>({ children }: PropsWithChildren<T>) {
//   const parent = useContainer();
//   parent.register()
//   return (
//     <ContainerContext.Provider value={parent}>
//       {children}
//     </ContainerContext.Provider>
//   );
// }

export const Route_Container_Provider = Container_Provider;
// export const Container_Provider = function ContainerRegister_Provider<T>({
//   children,
//   initialFn,
// }: PropsWithChildren<{
//   initialFn: { registerInstance: [InjectionToken<T>, T] }[];
// }>) {
//   const container = useContainer().createChildContainer();

//   useEffect(() => {
//     for (const args of initialFn) {
//       container.registerInstance(...args.registerInstance);
//     }
//   }, [container, initialFn]);

//   return (
//     <ContainerContext.Provider value={container}>
//       {children}
//     </ContainerContext.Provider>
//   );
// };
// export function Exchange_Provider({ children }: PropsWithChildren) {
//   const parent = useContainer();
//   parent.register([])
//   return (
//     <ContainerContext.Provider value={parent}>
//       {children}
//     </ContainerContext.Provider>
//   );
// }
