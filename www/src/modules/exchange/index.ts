//

import { useSession } from "next-auth/react";
import { useMemo } from "react";
import { fromClient } from "~/app/api/v1";
import { Exchange_CreateForm_Controller } from "./CreateForm.controller";
import { Exchange_Item_Controller } from "./Item.controller";
import { Exchange_List_Controller } from "./List.controller";
import { Exchange_Repository } from "./infrastructure";

//

export function useExchange_repository() {
  const { data: session } = useSession();

  return useMemo(
    () => new Exchange_Repository(fromClient, session?.user?.jwt),
    [session?.user?.jwt],
  );
}

//

export function useExchange_item_controller(exchange_id: number) {
  const repository = useExchange_repository();

  return useMemo(
    () => new Exchange_Item_Controller(repository, exchange_id),
    [repository, exchange_id],
  );
}

export function useExchange_list_controller() {
  const repository = useExchange_repository();

  return useMemo(() => new Exchange_List_Controller(repository), [repository]);
}

export function useExchange_create_controller() {
  const repository = useExchange_repository();

  return useMemo(
    () => new Exchange_CreateForm_Controller(repository),
    [repository],
  );
}
