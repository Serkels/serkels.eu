///

import { AuthError } from "@1/core/error";
import type { ReactNode } from "react";
import { NotFound } from "~/app/not-found";
import { this_door_is_yours } from "../this_door_is_yours";
import { Studient_NavBar } from "./aside_navbar";

//

export default async function Layout(props: {
  children: ReactNode;
  params: { code: string };
}) {
  try {
    const { code } = props.params;
    if (!(await this_door_is_yours(code))) {
      throw new AuthError("Wrong door");
    }

    return (
      <>
        <Studient_NavBar />
        {props.children}
      </>
    );
  } catch {
    return <NotFound />;
  }
}
