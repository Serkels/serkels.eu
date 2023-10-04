"use client";

import { trpc } from ":trpc/index";

//
export function Exchange_List() {
  console.log();
  // const dsf = trpc.useContext();
  // useEffect(() => {
  //   console.log({ dsf });

  //   const sdf = dsf.client.profile.me.query().then(console.log);
  // }, []);
  console.log();
  const sdf = trpc.profile.me.useQuery();
  return <code>{JSON.stringify({ sdf }, null, 2)}</code>;
}
