//

import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
  type QueryFunction,
} from "@tanstack/react-query";
import debug from "debug";
import { useSession } from "next-auth/react";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type PropsWithChildren,
} from "react";
import { AuthError, ViewModelError } from "~/core/errors";
import { useQuestion_repository } from ".";
import type { QuestionListSchema as Question_ListSchema } from "./dto";
import type { Question_CreateProps } from "./entity";
import type { Question_QueryProps, Question_Repository } from "./repository";

//

const log = debug("~:modules:question:Question_ViewModel");

//

interface Question_ViewModel_Struct {}

export class Question_ViewModel implements Question_ViewModel_Struct {
  constructor(private repository: Question_Repository) {}

  //

  query_keys = {
    all: ["questions"] as const,
    lists: () => [...this.query_keys.all, "list"] as const,
    question: (id: number | string) =>
      [...this.query_keys.all, String(id)] as const,
  };

  //

  create = { useMutation: this.useCreateMutation.bind(this) };
  lists = { useQuery: this.useListQuery.bind(this) };

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
      readonly string[],
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
      queryKey: this.query_keys.lists(),
      staleTime: Infinity,
    });

    return query_result;
  }

  // fetchAll = () => {
  //   const response = this.repository.getAllTodo(this.allTodoFetched);
  //   this.allTodoFetched(response);
  // };

  // private allTodoFetched = (asyncResponse: GetAllTodoResponse) => {
  //   console.log('privateAllTodoFetched', asyncResponse);
  //   const todoIds = asyncResponse.todos?.map((todo: Todo) => {
  //     // use the `setTodoItem` callback to update each todo item
  //     this.setTodo(todo);
  //     return todo.id;
  //   });
  //   if (todoIds) {
  //     this.setTodoIds(todoIds);
  //   }
  // };
}

//

const context = createContext<Question_ViewModel | null>(null);

export const Question_ViewModel_Provider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const questionRepository = useQuestion_repository();
  const questionViewModel = useMemo(
    () => new Question_ViewModel(questionRepository),
    [questionRepository],
  );

  return (
    <context.Provider value={questionViewModel}>{children}</context.Provider>
  );
};

export const useQuestion_view_model = () => {
  const viewModel = useContext(context);
  if (!viewModel) throw new ViewModelError("No Question provided");
  return viewModel;
};
