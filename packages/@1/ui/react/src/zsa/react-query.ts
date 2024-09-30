//

import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import { setupServerActionHooks } from "zsa-react-query";

//

// export const QueryKeyFactory = createServerActionsKeyFactory({
//   // [!code highlight]
//   getPosts: () => ["getPosts"], // [!code highlight]
//   getFriends: () => ["getFriends"], // [!code highlight]
//   getPostsAndFriends: () => ["getPosts", "getFriends"], // [!code highlight]
//   somethingElse: (id: string) => ["somethingElse", id], // [!code highlight]
//   getRandomNumber: () => ["getRandomNumber"], // [!code highlight]
// }); // [!code highlight]

//

export const {
  useServerActionQuery,
  useServerActionMutation,
  useServerActionInfiniteQuery,
} = setupServerActionHooks({
  hooks: {
    useQuery: useQuery,
    useMutation: useMutation,
    useInfiniteQuery: useInfiniteQuery,
  },
  // queryKeyFactory: QueryKeyFactory,
});
