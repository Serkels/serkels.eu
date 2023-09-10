//

import { useMemo } from "react";
import { useInject } from "~/core/react";
import { Exchange_CreateForm_Controller } from "./CreateForm.controller";
import { Exchange_Item_Controller } from "./Item.controller";
import { Exchange_List_Controller } from "./List.controller";
import { Exchange_Repository } from "./infrastructure";

//

export function useExchange_item_controller(exchange_id: number) {
  const repository = useInject(Exchange_Repository);

  return useMemo(
    () => new Exchange_Item_Controller(repository, exchange_id),
    [repository, exchange_id],
  );
}

export function useExchange_list_controller() {
  return useInject(Exchange_List_Controller);
}

export function useExchange_create_controller() {
  const repository = useInject(Exchange_Repository);

  return useMemo(
    () => new Exchange_CreateForm_Controller(repository),
    [repository],
  );
}
