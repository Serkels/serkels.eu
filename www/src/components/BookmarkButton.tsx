"use client";

import { Bookmark } from "@1/ui/icons";
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
  const isActive = Boolean(
    session?.user?.profile.bookmarks?.data?.some(
      ({ id }) => id === opportunity,
    ),
  );

  if (!session) return null;
  const className = classNameProp
    ? typeof classNameProp === "string"
      ? classNameProp
      : classNameProp({ isActive })
    : undefined;

  const onClick: MouseEventHandler<HTMLButtonElement> = useCallback(
    (event) => {
      event.preventDefault();
      event.stopPropagation();
      console.log(">BookmarkButton");
      console.log({ session, opportunity });
      console.log("<BookmarkButton");
    },
    [opportunity],
  );

  return (
    <button onClick={onClick} {...other_props}>
      <Bookmark className={clsx("", className)} />
    </button>
  );
}

// function useToggle({ opportunity }: { opportunity: number }) {
//   const { data: session } = useSession();

//   console.log({ session });
//   return useMutation({
//     mutationKey: [""],
//   });
// }

// const submitFormHandler=async({bookmarks}: )=>{
//     const res= await  fetch("/api/v1/user-profiles/me"
//     , {
//         method: 'PUT',
//         body: JSON.stringify({
//           "data": {"bookmarks": [{"id": 10, "position": { "end": true }}]}
//         }),
//         headers: {
//           'Content-type': 'application/json; charset=UTF-8',
//         },
//       })
//     const result=res.json();
//     return result;
// }
