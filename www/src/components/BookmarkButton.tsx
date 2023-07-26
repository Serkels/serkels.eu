"use client";

import { useUserMutation } from "@/app/my/useUserMutation";
import { Spinner } from "@1/ui/components/Spinner";
import { Bookmark } from "@1/ui/icons";
import clsx from "clsx";
import { useSession } from "next-auth/react";
import {
  useCallback,
  type ComponentPropsWithoutRef,
  type MouseEventHandler,
} from "react";
import { get_session_bookmarks_id } from "./get_session_bookmarks_id";

//

export function BookmarkButton(
  props: Omit<ComponentPropsWithoutRef<"button">, "className"> & {
    opportunity: number;
    className?: string | ((props: { isActive: boolean }) => string | undefined);
  },
) {
  const { className: classNameProp, opportunity, ...other_props } = props;
  const { data: session } = useSession();

  const actual_bookmarks = get_session_bookmarks_id(session);
  const isActive = actual_bookmarks.some((id) => id === String(opportunity));
  const className = classNameProp
    ? typeof classNameProp === "string"
      ? classNameProp
      : classNameProp({ isActive })
    : undefined;

  const { mutate, isLoading } = useUserMutation();
  const onClick: MouseEventHandler<HTMLButtonElement> = useCallback(
    (event) => {
      event.preventDefault();
      event.stopPropagation();

      const bookmarks = isActive
        ? actual_bookmarks.filter((id) => id !== String(opportunity))
        : actual_bookmarks.concat([String(opportunity)]);

      mutate({ bookmarks });
      return false;
    },
    [opportunity, isActive, actual_bookmarks],
  );

  //

  if (isLoading) return <Spinner className="h-4 w-4" />;
  if (!session) return null;

  return (
    <button onClick={onClick} className="w-6" {...other_props}>
      <Bookmark className={clsx("", className)} />
    </button>
  );
}
