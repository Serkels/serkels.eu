"use client";

import { TRPC_React } from "@1/strapi-trpc-router/react";
import dynamic from "next/dynamic";
import { useDeal_Value } from "../Deal.context";

const Exchange_Conversation_Timeline = dynamic(() =>
  import("../../../Exchange_Conversation_Timeline").then(
    (m) => m.Exchange_Conversation_Timeline,
  ),
);

//

export function Deal_Discussion() {
  const [deal] = useDeal_Value();
  const lol = TRPC_React.deal.message.all.useQuery({
    deal_id: Number(deal.id.value()),
  });
  return <>sdf{JSON.stringify(lol, null, 2)}</>;
}

// export function Deal_Discussion_() {
//   const [deal] = useDeal_Value();
//   const uid = useId();

//   useContainer().registerInstance(
//     Deal_Message_Repository.DEAL_ID_TOKEN,
//     deal.get("id"),
//   );
//   const lol = TRPC_React.deal.message.all.useQuery({
//     deal_id: Number(deal.id.value()),
//   });
//   console.log({ lol });
//   if (1) return <>{JSON.stringify(lol.data, null, 2)}</>;
//   const query_info = useQuery({
//     sort: ["createdAt:desc"],
//     pagination: { pageSize: 42 },
//   });
//   const on_refresh = useCallback(() => query_info.refetch(), [query_info]);
//   return (
//     <div onClick={on_refresh}>
//       {match(query_info.status)
//         .with("error", () => null)
//         .with("loading", () => null)
//         .with("success", () => {
//           return (
//             <Exchange_Conversation_Timeline key={uid} query_info={query_info} />
//           );
//         })
//         .exhaustive()}
//     </div>
//   );
// }
