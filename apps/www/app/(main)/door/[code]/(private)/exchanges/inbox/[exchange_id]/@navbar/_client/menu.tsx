"use client";

import { TRPC_React } from ":trpc/client";
import type { ID_Schema } from "@1.modules/core/domain";
import { Trash } from "@1.ui/react/icons";
import { ActionItem } from "@1.ui/react/menu";
import { useCallback } from "react";
import ContentLoader from "react-content-loader";

//

export function DeleteExchange_ActionItem({
  exchange_id,
}: {
  exchange_id: ID_Schema;
}) {
  const { is_archived, is_loading, toggle_add_to_archive } =
    useToggleArchiveExchange(exchange_id);

  if (is_loading)
    return (
      <ActionItem>
        <ContentLoader className="h-6 w-20" viewBox="0 0 100 100">
          <rect x="0" y="0" rx="4" ry="4" width="100%" height="100%" />
        </ContentLoader>
      </ActionItem>
    );

  return (
    <ActionItem
      className="text-left"
      onAction={toggle_add_to_archive}
      isDisabled={is_archived}
    >
      {is_archived ? (
        <>Cette échange est archivée.</>
      ) : (
        <>
          <Trash className="w-4" />
          <span className="w-full">Supprimer l'échange</span>
        </>
      )}
    </ActionItem>
  );
}

export function useToggleArchiveExchange(exchange_id: ID_Schema) {
  const has_exchange_id = TRPC_React.exchanges.me.archive.has.useQuery(
    {
      exchange_id,
    },
    { staleTime: Infinity },
  );
  const is_archived = has_exchange_id.data?.is_archived ?? false;
  const archive_exchange = TRPC_React.exchanges.me.archive.add.useMutation();
  const unarchive_exchange =
    TRPC_React.exchanges.me.archive.remove.useMutation();
  const utils = TRPC_React.useUtils();

  const toggle_add_to_archive = useCallback(async () => {
    if (is_archived) {
      // FUTURE(douglasduteil): uncomment when ready the archive feature is finished
      // await unarchive_exchange.mutateAsync({ exchange_id });
    } else {
      await archive_exchange.mutateAsync({ exchange_id });
    }

    await Promise.all([
      utils.exchanges.me.archive.has.invalidate({ exchange_id }),
      utils.exchanges.me.find.invalidate(),
    ]);
    archive_exchange.reset();
  }, [archive_exchange, utils, exchange_id]);

  return {
    toggle_add_to_archive,
    is_archived,
    is_loading:
      archive_exchange.status === "loading" ||
      has_exchange_id.status === "loading" ||
      unarchive_exchange.status === "loading",
  };
}
