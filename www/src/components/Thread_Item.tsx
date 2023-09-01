// "use client";

import { Thread } from "@1/modules/inbox/domain";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import tw from "tailwind-styled-components";
import type { ClassProp } from "tailwind-variants";
import { P, match } from "ts-pattern";
import { Avatar_Show_Profile } from "~/components/Avatar_Show_Profile";

export function Thread_Item({
  href,
  thread,
  indicator,
}: {
  href: string;
  thread: Thread;
  indicator?: ((tvStyle?: ClassProp) => ReactNode) | ReactNode;
}) {
  const pathname = usePathname() ?? "";

  // TODO(douglasduteil): Unify the logic with "useIsActive"
  const active =
    pathname.split("/").length >= href.split("/").length &&
    href.includes(pathname);

  return (
    <Thread_Card $active={active}>
      <Thread_Header>
        <Avatar_Show_Profile profile={thread.profile} />
        <Thread_Time dateTime={thread.last_update} title={thread.last_update}>
          {thread.last_update}
        </Thread_Time>
      </Thread_Header>
      <Link href={href}>
        <div className="float-right">
          {match(indicator)
            .with(P.instanceOf(Function), (indicator_fn) => indicator_fn())
            .otherwise(() => (
              <>{indicator}</>
            ))}
        </div>
        <Thread_Excerpt
          $active={active}
          title={thread.last_message?.the_excerpt}
        >
          {thread.last_message?.the_excerpt}
        </Thread_Excerpt>
      </Link>
    </Thread_Card>
  );
}

// TODO(douglasduteil): use fv slots here...
const Thread_Header = tw.header`
  flex
  justify-between
`;
const Thread_Time = tw.time`
  text-xs
  font-bold
`;
const Thread_Card = tw.div<{ $active: boolean }>`
  block
  space-y-5
  rounded-xl
  border
  border-[#ECEDF4]
  bg-white
  p-4
  text-black
  shadow-[10px_10px_10px_#00000014]
`;
const Thread_Excerpt = tw.p<{ $active: boolean }>`
  mb-1
  line-clamp-1
  pt-5
`;
