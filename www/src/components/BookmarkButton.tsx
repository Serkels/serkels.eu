"use client";

import type { Bookmark_Category } from "@1/modules/bookmark/domain";
import { useInject } from "@1/next-tsyringe";
import { Spinner } from "@1/ui/components/Spinner";
import { Bookmark } from "@1/ui/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import { useSession } from "next-auth/react";
import { useCallback, type MouseEventHandler } from "react";
import { Is_In_Bookmarks_UseCase } from "~/modules/bookmarks/application/is_in_bookmarks.use-case";
import { Bookmarks_Repository } from "~/modules/bookmarks/bookmarks.repository";

//

export function BookmarkButton(props: {
  id: number;
  type: Bookmark_Category;
  className?: string | ((props: { isActive: boolean }) => string | undefined);
}) {
  const { className: classNameProp, type, id: opportunity } = props;
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  //

  const repository = useInject(Bookmarks_Repository);
  const { data: is_in_bookmarks, isLoading: isDataLoading } = useInject(
    Is_In_Bookmarks_UseCase,
  ).execute(type, opportunity);

  const isActive = Boolean(is_in_bookmarks?.ok ?? false);

  //

  const onSettled = async () => {
    await Promise.all([
      queryClient.refetchQueries({
        queryKey: Bookmarks_Repository.keys.check(type, opportunity),
      }),
      queryClient.refetchQueries({
        queryKey: Bookmarks_Repository.keys.opportunity(),
      }),
    ]);
  };
  const { mutate: save_bookmark, isLoading: isSaveLoading } = useMutation({
    mutationFn: () => repository.save(type, opportunity),
    onSettled,
  });
  const { mutate: delete_bookmark, isLoading: isDeleteLoading } = useMutation({
    mutationFn: () => repository.delete(type, opportunity),
    onSettled,
  });
  const isLoading = isDataLoading || isSaveLoading || isDeleteLoading;

  const className = classNameProp
    ? typeof classNameProp === "string"
      ? classNameProp
      : classNameProp({ isActive })
    : undefined;

  const onClick: MouseEventHandler<HTMLButtonElement> = useCallback(() => {
    isActive ? delete_bookmark() : save_bookmark();
  }, [isActive]);

  //

  if (!session) return null;
  if (isLoading)
    return (
      <div className="inline-block w-6">
        <Spinner className="h-4 w-4" />
      </div>
    );

  return (
    <button onClick={onClick} className="w-6">
      <Bookmark className={clsx("", className)} />
    </button>
  );
}
