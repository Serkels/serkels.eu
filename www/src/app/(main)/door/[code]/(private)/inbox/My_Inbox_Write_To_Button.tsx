"use client";

import { Button } from "@1/ui/components/ButtonV";
import * as UI from "@1/ui/domains/exchange/AskModal";
import { useUserData } from "~/modules/user";

//

export function My_Inbox_Write_To_Button() {
  return (
    <UI.DialogTrigger>
      <Button intent="danger">Écrire</Button>
      <UI.Modal>
        <UI.Dialog>
          <Write_Body />
        </UI.Dialog>
      </UI.Modal>
    </UI.DialogTrigger>
  );
}

//

function Write_Body() {
  const {
    contacts: { useInfiniteQuery },
  } = useUserData();
  const info = useInfiniteQuery({ pageSize: 1 });

  return <>{JSON.stringify(info, null, 2)}</>;
}
