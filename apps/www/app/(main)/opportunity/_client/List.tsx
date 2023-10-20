"use client";

import { ErrorOccur } from "@1.ui/react/error";

//

export default function List() {
  // const search_params = useSearchParams();
  // const category = search_params.get("category") ?? undefined;
  // const search = search_params.get("q") ?? undefined;

  try {
    return <>Yo</>;
  } catch (error) {
    return <ErrorOccur error={error as Error} />;
  }
}
