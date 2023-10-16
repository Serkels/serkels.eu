"use client";

import { useSession } from "next-auth/react";

//

export default function Welcome_Flow() {
  const { data: session, status } = useSession({ required: true });
  return (
    <div>
      <p>Welcome</p>
      <br />
      <code>{JSON.stringify(status, null, 2)}</code>;
      <br />
      <code>{JSON.stringify(session, null, 2)}</code>;
    </div>
  );
}
