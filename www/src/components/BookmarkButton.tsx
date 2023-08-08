"use client";

import {
  useBookmarkedOpportunitiesIdsMutation,
  useBookmarksQuery,
} from "@/app/my/bookmarks/opportunities/useBookmarkedOpportunitiesIds";
import { Spinner } from "@1/ui/components/Spinner";
import { Bookmark } from "@1/ui/icons";
import clsx from "clsx";
import { useSession } from "next-auth/react";
import {
  useCallback,
  type ComponentPropsWithoutRef,
  type MouseEventHandler,
} from "react";
import { get_bookmark_opportunities_ids } from "./get_session_bookmarks_id";

//

export function BookmarkButton(
  props: Omit<ComponentPropsWithoutRef<"button">, "className"> & {
    opportunity: number;
    className?: string | ((props: { isActive: boolean }) => string | undefined);
  },
) {
  const { className: classNameProp, opportunity, ...other_props } = props;
  const { data: session } = useSession();

  const { data: bookmarks, isFetching } = useBookmarksQuery(session?.user?.jwt);
  const actual_bookmarks = get_bookmark_opportunities_ids(
    bookmarks?.attributes,
  );

  const isActive = actual_bookmarks.some((id) => id === opportunity) ?? false;

  const { mutate, isLoading } = useBookmarkedOpportunitiesIdsMutation(
    bookmarks?.id,
  );

  const className = classNameProp
    ? typeof classNameProp === "string"
      ? classNameProp
      : classNameProp({ isActive })
    : undefined;

  const onClick: MouseEventHandler<HTMLButtonElement> = useCallback(
    (event) => {
      event.preventDefault();
      event.stopPropagation();

      const opportunities = isActive
        ? actual_bookmarks.filter((id) => id !== opportunity)
        : actual_bookmarks.concat([opportunity]);

      mutate({ opportunities });
      return false;
    },
    [opportunity, isActive, actual_bookmarks],
  );

  //

  if (!session) return null;
  if (isLoading || isFetching) return <Spinner className="h-4 w-4" />;

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
