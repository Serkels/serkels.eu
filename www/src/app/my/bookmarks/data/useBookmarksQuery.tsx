"use client";

import { fromClient } from "@/app/api/v1";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { BookmarksRepository } from "./BookmarksRepository";

//

export const queryKey = ["bookmarks"] as const;

export function useBookmarksQuery() {
  const { data: session } = useSession();
  const jwt = session?.user?.jwt;
  return useQuery({
    enabled: Boolean(jwt),
    queryKey,
    queryFn: async () => new BookmarksRepository(fromClient, jwt).load(),
  });
}
