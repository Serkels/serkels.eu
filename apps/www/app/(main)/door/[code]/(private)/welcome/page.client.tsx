"use client";

import { Avatar } from "@1.ui/react/avatar";
import { Button } from "@1/ui/components/ButtonV";
import { signOut, useSession } from "next-auth/react";

//

export default function Welcome_Flow() {
  const { data: session, status, update } = useSession({ required: true });

  return (
    <>
      <div className="">
        <Avatar image={session?.profile?.image} className="mt-5 h-32" />
        <p className="mt-5 text-xl font-extrabold">{session?.profile?.name}</p>
        <div className="hidden text-left ">
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
    </>
  );
}
