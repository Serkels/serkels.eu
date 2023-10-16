"use client";

import { Button } from "@1/ui/components/ButtonV";
import { signOut, useSession } from "next-auth/react";

//

export default function Welcome_Flow() {
  const { data: session, status, update } = useSession({ required: true });

  return (
    <div>
      <p>Welcome</p>
      <div className="text-left">
        <br />
        <code>{JSON.stringify(status, null, 2)}</code>;
        <br />
        <code>{JSON.stringify(session, null, 2)}</code>;
        <br />
        <Button intent="secondary" onPress={() => update()}>
          Update
        </Button>
        <br />
        <Button intent="danger" onPress={() => signOut()}>
          Logout
        </Button>
        <br />
      </div>
    </div>
  );
}
