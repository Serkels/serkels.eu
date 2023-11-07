//

import type { Exchange } from "@1.modules/exchange.domain";
import { Card } from "@1.modules/exchange.ui/Card/Card";
import { StudientAvatarMedia } from "@1.modules/profile.ui/avatar";
import Link from "next/link";
import { Exchange_Actions } from "./actions";
import { Exchange_Bookmark } from "./bookmark";
import { Exchange_Share } from "./share";

//

export function Exchange_Card(exchange: Exchange) {
  return (
    <Card exchange={exchange}>
      <Card.Header.Left>
        <Link href={`/@${exchange.owner.profile.id}`}>
          <StudientAvatarMedia studient={exchange.owner} />
        </Link>
      </Card.Header.Left>
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
