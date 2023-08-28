"use client";

import Link from "next/link";
import tw from "tailwind-styled-components";

//

export function NavControlGroup({ exchange_id }: { exchange_id: number }) {
  return (
    <UI.Group>
      <UI.Indicator>1/3</UI.Indicator>
      {false ? <LinkIcon href={""}>{"<"}</LinkIcon> : <Icon>{"<"}</Icon>}
      {exchange_id ? <LinkIcon href={""}>{">"}</LinkIcon> : <Icon>{">"}</Icon>}
    </UI.Group>
  );
}

//
const Icon = tw.span`
  text-[25px]
  text-[#707070]
  opacity-40
`;

const LinkIcon = tw(Link)`
  text-[25px]
`;

const Indicator = tw.nav`
  text-xl
`;
const Group = tw.nav`
  flex
  flex-row
  items-center
  justify-center
  space-x-4
`;

//

const UI = { Group, Indicator };
