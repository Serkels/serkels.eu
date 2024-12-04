"use client";

import { trpc_client } from "@1.infra/trpc/react-query/client";
import { Button } from "@1.ui/react/button";
import { Trash } from "@1.ui/react/icons";
import { Spinner } from "@1.ui/react/spinner";
import { useTimeoutEffect } from "@react-hookz/web";
import constate from "constate";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { match } from "ts-pattern";

//

type Outlet_State =
  | { state: "deleting" }
  | { state: "error"; error: Error }
  | { state: "idle" }
  | { state: "loading" }
  | { state: "should_delete" };

function useDeleteContext({ opportunity_id }: { opportunity_id: string }) {
  const outlet = useState<Outlet_State>({ state: "idle" });
  return { outlet, opportunity_id };
}

const [Provider, useOutletState, useOpportunity] = constate(
  useDeleteContext,
  ({ outlet }) => outlet,
  ({ opportunity_id }) => ({ id: opportunity_id }),
);

export function Opportunity_Delete_Button({
  opportunity_id,
}: {
  opportunity_id: string;
}) {
  return (
    <Provider opportunity_id={opportunity_id}>
      <Outlet />
    </Provider>
  );
}

function Outlet() {
  const [outlet] = useOutletState();
  return match(outlet)
    .with({ state: "deleting" }, () => <Deleting />)
    .otherwise(() => <Idle />);
}

function Idle() {
  const [outlet, set_outlet] = useOutletState();
  const should_delete = outlet.state === "should_delete";

  useEffect(() => {
    if (!should_delete) return;

    if (!window.confirm("Êtes vous sur de vouloir supprimer cette echange ?")) {
      set_outlet({ state: "idle" });
      return;
    }

    set_outlet({ state: "deleting" });
  }, [should_delete]);

  return (
    <Button
      variant={{ intent: "light", size: "sm", state: "ghost" }}
      className="box-content h-4 py-2"
      onPress={() => set_outlet({ state: "should_delete" })}
    >
      <Trash className="h-full" />
    </Button>
  );
}

function Deleting() {
  const { id: opportunity_id } = useOpportunity();

  const delete_opportunity = trpc_client.opportunity.delete.useMutation();
  const router = useRouter();
  const utils = trpc_client.useUtils();

  useTimeoutEffect(async () => {
    await delete_opportunity.mutateAsync(opportunity_id);

    await Promise.all([
      utils.opportunity.by_id.invalidate(opportunity_id),
      utils.opportunity.find.invalidate(),
    ]);

    router.push("/opportunities");
  }, 1_111);

  return (
    <section className="text-center">
      <Spinner className="size-5" />
    </section>
  );
}
