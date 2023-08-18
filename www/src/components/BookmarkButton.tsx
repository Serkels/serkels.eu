"use client";

import { fromClient } from "@/app/api/v1";
import { BookmarksRepository } from "@/app/my/bookmarks/data/BookmarksRepository";
import { Spinner } from "@1/ui/components/Spinner";
import { Bookmark } from "@1/ui/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import { useSession } from "next-auth/react";
import {
  useCallback,
  type ComponentPropsWithoutRef,
  type MouseEventHandler,
} from "react";

//

export function BookmarkButton(
  props: Omit<ComponentPropsWithoutRef<"button">, "className"> & {
    opportunity: number;
    className?: string | ((props: { isActive: boolean }) => string | undefined);
  },
) {
  const { className: classNameProp, opportunity, ...other_props } = props;
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  //

  const repository = new BookmarksRepository(fromClient, session?.user?.jwt);

  const jwt = session?.user?.jwt;
  const { data: bookmarks, isLoading: isDataLoading } = useQuery({
    enabled: Boolean(jwt),
    queryKey: BookmarksRepository.queryKey,
    queryFn: async () => new BookmarksRepository(fromClient, jwt).load(),
    staleTime: Infinity,
  });

  const bookmark = bookmarks?.data?.find(
    ({ attributes }) => attributes?.opportunity?.data?.id === opportunity,
  );
  const isActive = Boolean(bookmark);

  //

  const onSettled = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: BookmarksRepository.queryKey }),
      queryClient.invalidateQueries({
        queryKey: ["my", "bookmarks", "opportunities"],
      }),
    ]);
  };
  const { mutate: save_bookmark, isLoading: isSaveLoading } = useMutation(
    repository.save.bind(repository),
    { onSettled },
  );
  const { mutate: delete_bookmark, isLoading: isDeleteLoading } = useMutation(
    repository.delete.bind(repository),
    { onSettled },
  );
  const isLoading = isDataLoading || isSaveLoading || isDeleteLoading;

  const className = classNameProp
    ? typeof classNameProp === "string"
      ? classNameProp
      : classNameProp({ isActive })
    : undefined;

  const onClick: MouseEventHandler<HTMLButtonElement> = useCallback(
    (event) => {
      event.preventDefault();
      event.stopPropagation();

      const bookmark_id = bookmark?.id;

      bookmark_id
        ? delete_bookmark(bookmark_id)
        : save_bookmark({ opportunity });

      return false;
    },
    [bookmark?.id, opportunity, isActive],
  );

  //

  if (!session) return null;
  if (isLoading) return <Spinner className="h-4 w-4" />;

  return (
    <button
      onClick={onClick}
      // disabled={isIdle}
      className="w-6"
      {...other_props}
    >
      <Bookmark className={clsx("", className)} />
    </button>
  );
}
