import { AuthError } from "@1/core/error";
import { getServerSession } from "next-auth/next";
import type { PropsWithChildren } from "react";
import { z } from "zod";
import { authOptions } from "~/app/api/auth/[...nextauth]/route";
import NotFound from "~/app/not-found";
import { DoorId } from "./door.context";
import { Door_Provider } from "./door.context.client";

export async function this_door_is_yours(code: number | string) {
  const session = await getServerSession(authOptions);
  const user_id = DoorId.parse(session?.user?.id);
  const door_id = DoorId.parse(code);
  return door_id === user_id;
}

export async function Your_Door_Lock({
  children,
  params,
}: PropsWithChildren<{ params: { code: string } }>) {
  console.log(".........");
  const session = await getServerSession(authOptions);

  const { code } = params;
  const user_id = z.coerce.number().parse(session?.user?.id);

  console.log({ user_id, code });

  try {
    const door_id = z.coerce.number().parse(code);
    const is_yours = door_id === user_id;

    if (!is_yours) throw new AuthError("No authorized.");

    return (
      <Door_Provider initialValue={{ door_id, is_yours }}>
        {children}
      </Door_Provider>
    );
  } catch {
    return <NotFound />;
  }
}

// export async function Your_Door_Layout({ children }: PropsWithChildren) {
//   const [{ is_yours }] = useDoor_Value();
//   return is_yours ? children : <NotFound />;
// }

// export async function _Your_Door_Lock({
//   children,
//   params,
// }: PropsWithChildren<{ params: { username: string } }>) {
//   const session = await getServerSession(authOptions);
//   const user_id = z.coerce.number().parse(session?.user?.id);

//   try {
//     z.coerce
//       .number()
//       .transform((door_id) => door_id === user_id)
//       .parse(params.username);

//     return (children
//       // <YourDoor_Provider initialValue={true}>{children}</YourDoor_Provider>
//     );
//   } catch {
//     return <NotFound />;
//   }
//   // const is_your_door = z.coerce
//   //   .number()
//   //   .transform((door_id) => door_id === user_id)
//   //   .parse(params.username);

//   // return is_your_door ? (
//   //   <YourDoor_Provider initialValue={is_your_door}>
//   //     {children}
//   //   </YourDoor_Provider>
//   // ) : (
//   //   <NotFound />
//   // );
// }
