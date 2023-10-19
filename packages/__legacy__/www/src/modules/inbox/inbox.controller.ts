//

import { useMutation, useQuery } from "@tanstack/react-query";
import debug from "debug";
import { Inbox_Repository } from "./inbox.repository";
import { Inbox_QueryKeys } from "./query_keys";

//

const log = debug("~:modules:exchange:Inbox_Controller");

export class Inbox_Controller {
  constructor(private repository: Inbox_Repository) {
    log("new");
  }

  //

  by_participent = {
    // TODO(douglasduteil): migrate this to an application
    useQuery: (id: number) => {
      return useQuery({
        queryFn: () => this.repository.find_by_participant(id),
        queryKey: Inbox_QueryKeys.by_participent(id),
        staleTime: Infinity,
        retry: false,
      });
    },
    useMutation: (id: number) => {
      return useMutation({
        mutationFn: () => this.repository.create(id),
      });
    },
  };

  //
}
