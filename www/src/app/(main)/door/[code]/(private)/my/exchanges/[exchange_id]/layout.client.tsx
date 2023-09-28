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
