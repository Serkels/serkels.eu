//

import { AuthError } from "@1/core/error";
import type { ReactNode } from "react";
import { match } from "ts-pattern";
import { get_session_user_role } from "~/app/api/auth/[...nextauth]/route";
import { NotFound } from "~/app/not-found";
import { this_door_is_yours } from "../this_door_is_yours";
import { Partner_NavBar, Studient_NavBar } from "./aside_navbar";

//

export default async function Layout(props: {
  children: ReactNode;
  params: { code: string };
}) {
  try {
    const { code } = props.params;

    const [is_yours, role] = await Promise.all([
      this_door_is_yours(code),
      get_session_user_role(),
    ]);

    if (!is_yours || !role) {
      throw new AuthError("Wrong door");
    }

    return (
      <>
        {match(role)
          .with("partner", () => <Partner_NavBar />)
          .with("studient", () => <Studient_NavBar />)
          .exhaustive()}
        {props.children}
      </>
    );
  } catch {
    return <NotFound />;
  }
}
