"use client";

import { Spinner } from "@1/ui/components/Spinner";
import { Bookmark } from "@1/ui/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import { useSession } from "next-auth/react";
import {
  useCallback,
  type ComponentPropsWithoutRef,
  type MouseEventHandler,
} from "react";
import { useInject } from "~/core/react";
import { Is_In_Bookmarks_UseCase } from "~/modules/bookmarks/application/is_in_bookmarks.use-case";
import { Bookmarks_Repository } from "~/modules/bookmarks/bookmarks.repository";

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

  const repository = useInject(Bookmarks_Repository);
  const { data: is_in_bookmarks, isLoading: isDataLoading } = useInject(
    Is_In_Bookmarks_UseCase,
  ).execute("opportunity", opportunity);

  const isActive = Boolean(is_in_bookmarks?.ok ?? false);

  //

  const onSettled = async () => {
    console.log({ isActive, is_in_bookmarks });
    await Promise.all([
      queryClient.refetchQueries({
        queryKey: Bookmarks_Repository.keys.check("opportunity", opportunity),
      }),
      queryClient.refetchQueries({
        queryKey: Bookmarks_Repository.keys.opportunity(),
      }),
    ]);
  };
  const { mutate: save_bookmark, isLoading: isSaveLoading } = useMutation({
    mutationFn: () => repository.save("opportunity", opportunity),
    onSettled,
  });
  const { mutate: delete_bookmark, isLoading: isDeleteLoading } = useMutation({
    mutationFn: () => repository.delete("opportunity", opportunity),
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
