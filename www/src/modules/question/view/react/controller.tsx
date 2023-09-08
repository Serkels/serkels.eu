//

import { AuthError } from "@1/core/domain";
import type { Question_ListSchema } from "@1/strapi-openapi";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
  type QueryFunction,
} from "@tanstack/react-query";
import debug from "debug";
import { useSession } from "next-auth/react";
import { useCallback, useEffect } from "react";
import "reflect-metadata";
import { inject, singleton } from "tsyringe";
import type { Question_CreateProps } from "../../entity";
import {
  Question_Repository,
  type Question_QueryProps as Question_QueryParamsProps,
} from "../../repository";

//

@singleton()
export class Question_Controller {
  #log = debug(`~:modules:question:${Question_Controller}`);
  constructor(
    @inject(Question_Repository)
    private readonly repository: Question_Repository,
  ) {
    this.#log("new");
  }

  //
  query_keys = {
    all: ["question"] as const,
    lists: (options?: Question_QueryParamsProps["filter"] | undefined) =>
      [...this.query_keys.all, "list", ...(options ? [options] : [])] as const,
    question: (id: number | string) =>
      [...this.query_keys.all, String(id)] as const,
  };

  //
  create = { useMutation: this.useCreateMutation.bind(this) };
  lists = {
    useQuery: this.useListQuery.bind(this),
  };

  //
  useCreateMutation() {
    const { data: session } = useSession();
    const queryClient = useQueryClient();

    const createQuestionFn = async ({
      title,
      category,
    }: Omit<Question_CreateProps, "owner">) => {
      this.#log("createQuestionFn");
      const id = session?.user?.id;
      if (!id) throw new AuthError("Invalid Session");

      await this.repository.create({
        category: Number(category),
        owner: id,
        title,
      });
    };

    const mutation_result = useMutation(
      useCallback(createQuestionFn, [this.repository, session?.user?.id]),
    );

    useEffect(() => {
      if (mutation_result.status !== "success") return;
      Promise.all([
        queryClient.invalidateQueries({ queryKey: this.query_keys.lists() }),
      ]);
    }, [mutation_result.isSuccess]);

    return mutation_result;
  }

  useListQuery(params: Question_QueryParamsProps) {
    const loadListFn: QueryFunction<
      Question_ListSchema,
      ReturnType<typeof this.query_keys.lists>,
      number
    > = async ({ pageParam: page }) => {
      params.pagination = Object.assign(params.pagination ?? {}, {
        page,
      } as Question_QueryParamsProps["pagination"]);
      return this.repository.findAll(params);
    };

    const getNextPageParam = (lastPage: Question_ListSchema) => {
      const pagination = lastPage.meta?.pagination ?? { pageCount: 0, page: 0 };
      const { pageCount, page } = pagination;
      this.#log("getNextPageParam", { pageCount, page });
      if (pageCount === undefined || page === undefined) return;

      return page >= pageCount ? undefined : page + 1;
    };

    const getPreviousPageParam = (lastPage: Question_ListSchema) => {
      const pagination = lastPage.meta?.pagination ?? { page: 0 };
      const { page } = pagination;
      if (page === undefined) return;

      return page > 0 ? page - 1 : undefined;
    };

    const query_info = useInfiniteQuery({
      getNextPageParam,
      getPreviousPageParam,
      queryFn: useCallback(loadListFn, [
        this.repository,
        params.filter?.category,
        params.filter?.search,
      ]),
      queryKey: this.query_keys.lists(params.filter),
      staleTime: Infinity,
    });

    return query_info;
  }
}
