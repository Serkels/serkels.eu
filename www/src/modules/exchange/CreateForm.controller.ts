//

import { AuthError } from "@1/core/error";
import { Type } from "@1/modules/exchange/domain/Type.value";
import type { FormValues } from "@1/ui/domains/exchange/CreateForm";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import debug from "debug";
import { useSession } from "next-auth/react";
import { useCallback, useEffect } from "react";
import type { Exchange_Repository } from "./infrastructure";

//

const log = debug("~:modules:exchange:Exchange_CreateForm_Controller");

//

export const Exchange_QueryKeys = {
  all: ["exchange"] as const,
  lists() {
    return [...this.all, "list"];
  },
  // lists(options?: Question_QueryParamsProps["filter"] | undefined) {
  //   return [...this.all, "list", ...(options ? [options] : [])] as const,
  // }
  // question: (id: number | string) =>
  //   [...this.query_keys.all, String(id)] as const,
};

export class Exchange_CreateForm_Controller {
  constructor(private repository: Exchange_Repository) {}
  create = { useMutation: this.useCreateMutation.bind(this) };

  useCreateMutation() {
    const { data: session } = useSession();
    const queryClient = useQueryClient();

    const createQuestionFn = async (props: FormValues) => {
      log("createQuestionFn");
      const id = session?.user?.id;
      if (!id) throw new AuthError("Invalid Session");
      const { in_exchange_of, ...other_props } = props;
      await this.repository.create({
        ...other_props,
        ...(in_exchange_of ? { in_exchange_of } : {}),
        available_places: Number(props.places),
        type: Type.create(props.type).value().get("value"),
      });
    };

    const mutation_result = useMutation(
      useCallback(createQuestionFn, [this.repository, session?.user?.id]),
    );

    useEffect(() => {
      if (mutation_result.status !== "success") return;
      Promise.all([
        queryClient.invalidateQueries({ queryKey: Exchange_QueryKeys.lists() }),
      ]);
    }, [mutation_result.isSuccess]);

    return mutation_result;
  }
}
