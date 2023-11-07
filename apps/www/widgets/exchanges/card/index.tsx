"use client";

import type { Exchange } from "@1.modules/exchange.domain";
import { Card } from "@1.modules/exchange.ui/Card/Card";
import { Expiry_Date } from "@1.modules/exchange.ui/Card/Expiry_Date";
import type { Profile } from "@1.modules/profile.domain";
import { StudientAvatarMedia } from "@1.modules/profile.ui/avatar";
import { button } from "@1.ui/react/button/atom";
import { Pen } from "@1.ui/react/icons";
import Link from "next/link";
import { Exchange_Actions } from "./actions";
import { Exchange_Bookmark } from "./bookmark";
import { Exchange_Delete_Button } from "./delete.button";
import { Exchange_Share } from "./share";

//

// TODO(douglasduteil): remove hard links on widgets
// TODO(douglasduteil): remove next connection

//

export function Exchange_Card({
  exchange,
  profile,
}: {
  exchange: Exchange;
  profile: Pick<Profile, "id">;
}) {
  // const delete = TRPC_React.ex;
  const is_yours = exchange.owner.profile.id === profile.id;

  return (
    <Card exchange={exchange}>
      <Card.Header.Left>
        <Link href={`/@${exchange.owner.profile.id}`}>
          <StudientAvatarMedia studient={exchange.owner} />
        </Link>
      </Card.Header.Left>
      <Card.Header.Right>
        <div className=" flex flex-row items-center space-x-2">
          {is_yours ? (
            <>
              <Link
                className={button({
                  intent: "light",
                  size: "sm",
                  state: "ghost",
                  className: "box-content h-4 py-2",
                })}
                // className="h-4 text-Dove_Gray hover:text-Dove_Gray/50"
                href={`/@~/exchanges/${exchange.id}/edit`}
              >
                <Pen className="h-4" />
              </Link>
              <Exchange_Delete_Button />
            </>
          ) : null}
          <Expiry_Date />
        </div>
      </Card.Header.Right>
      <Card.Footer.Left>
        <Exchange_Bookmark />
      </Card.Footer.Left>
      <Card.Footer.Center>
        <Exchange_Actions />
      </Card.Footer.Center>
      <Card.Footer.Right>
        <Exchange_Share />
      </Card.Footer.Right>
    </Card>
  );
}
