///

import { ID_Schema } from "@1/core/domain";
import { DefaultProvider, NextTsyringe } from "@1/next-tsyringe";
import { Root_Module } from "~/app/layout";
import { Deal_Message_Repository } from "~/modules/exchange/Deal_Message.repository";

//

@NextTsyringe.module({
  parent: Root_Module,
  async registrationFn({ params }) {
    const deal_id =
      ID_Schema.parse(params["deal_id"], {
        path: ["params.deal_id"],
      }) ?? NaN;

    return [
      {
        token: Deal_Message_Repository.DEAL_ID_TOKEN,
        useValue: deal_id,
      },
    ];
  },
})
export class DealId_Module {
  static Provider = DefaultProvider;
}

export default DealId_Module.Provider;
