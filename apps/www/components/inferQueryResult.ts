//

import type {
  InfiniteQueryObserverSuccessResult,
  QueryObserverSuccessResult,
  UseInfiniteQueryResult,
  UseQueryResult,
} from "@tanstack/react-query";

//

export type inferInfiniteQueryObserverSuccessResult<
  TQueryResult extends UseQueryResult,
> =
  TQueryResult extends UseInfiniteQueryResult<infer $Data, infer $Error>
    ? InfiniteQueryObserverSuccessResult<$Data, $Error>
    : never;

export type inferQueryObserverSuccessResult<
  TQueryResult extends UseQueryResult,
> =
  TQueryResult extends UseQueryResult<infer $Data, infer $Error>
    ? QueryObserverSuccessResult<$Data, $Error>
    : never;
