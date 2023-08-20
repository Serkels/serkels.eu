//

import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
  type QueryFunction,
} from "@tanstack/react-query";
import debug from "debug";
import { useSession } from "next-auth/react";
import { useCallback } from "react";
import { getQueryClient } from "~/app/getQueryClient";
import { AuthError } from "~/core/errors";
import type { QuestionListSchema as Question_ListSchema } from "../../dto";
import type { Question_CreateProps } from "../../entity";
import type {
  Question_QueryProps,
  Question_Repository,
} from "../../repository";

//

const log = debug("~:modules:question:Question_Controller");

//

export class Question_Controller {
  constructor(private repository: Question_Repository) {}

  //
  query_keys = {
    all: ["questions"] as const,
    lists: (options?: Question_QueryProps["filter"] | undefined) =>
      [...this.query_keys.all, "list", options] as const,
    question: (id: number | string) =>
      [...this.query_keys.all, String(id)] as const,
  };

  //
  create = { useMutation: this.useCreateMutation.bind(this) };
  lists = {
    useQuery: this.useListQuery.bind(this),
    prefetchQuery: this.prefetchListQuery.bind(this),
  };

  //
  useCreateMutation() {
    const { data: session } = useSession();
    const queryClient = useQueryClient();

    const createQuestionFn = async ({
      title,
      category,
    }: Omit<Question_CreateProps, "owner">) => {
      log("createQuestionFn");
      const id = session?.user?.id;
      if (!id) throw new AuthError("Invalid Session");

      await this.repository.create({
        category: Number(category),
        owner: id,
        title,
      });

      Promise.all([
        queryClient.invalidateQueries({ queryKey: this.query_keys.lists() }),
      ]);
    };

    return useMutation(
      useCallback(createQuestionFn, [this.repository, session?.user?.id]),
    );
  }

  useListQuery(filter: Question_QueryProps) {
    const { data: session } = useSession();

    const loadListFn: QueryFunction<
      Question_ListSchema,
      ReturnType<typeof this.query_keys.lists>,
      number
    > = async ({ pageParam: page }) => {
      const id = session?.user?.id;
      if (!id) throw new AuthError("Invalid Session");

      filter.pagination = Object.assign(filter.pagination ?? {}, {
        page,
      } as Question_QueryProps["pagination"]);
      return this.repository.findAll(filter);
    };

    const getNextPageParam = (lastPage: Question_ListSchema) => {
      const pagination = lastPage.meta?.pagination ?? { pageCount: 0, page: 0 };
      const { pageCount, page } = pagination;
      log("getNextPageParam", { pageCount, page });
      if (pageCount === undefined || page === undefined) return;

      return page >= pageCount ? undefined : page + 1;
    };

    const getPreviousPageParam = (lastPage: Question_ListSchema) => {
      const pagination = lastPage.meta?.pagination ?? { page: 0 };
      const { page } = pagination;
      if (page === undefined) return;

      return page > 0 ? page - 1 : undefined;
    };

    const query_result = useInfiniteQuery({
      getNextPageParam,
      getPreviousPageParam,
      queryFn: useCallback(loadListFn, [this.repository]),
      queryKey: this.query_keys.lists(filter.filter),
      staleTime: Infinity,
    });

    return query_result;
  }

  prefetchListQuery(filter: Question_QueryProps) {
    const queryClient = getQueryClient();
    const queryFn = () => this.repository.findAll(filter);
    return queryClient.prefetchInfiniteQuery(
      this.query_keys.lists(filter.filter),
      queryFn,
    );
  }
}
