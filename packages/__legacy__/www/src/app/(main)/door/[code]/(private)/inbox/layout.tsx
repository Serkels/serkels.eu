///

import type { Metadata, ResolvingMetadata } from "next";
import type { PropsWithChildren } from "react";
import tw from "tailwind-styled-components";
import { My_Inbox_Nav } from "./My_Inbox_Nav";
import { My_Inbox_Write_To_Button } from "./My_Inbox_Write_To_Button";
import { Inbox_UserThread_List } from "./layout.client";

//
export async function generateMetadata(
  _: unknown,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  return {
    title: `Inbox :: ${(await parent).title?.absolute}`,
  };
}

//

export default function Layout({ children }: PropsWithChildren) {
  return (
    <>
      <My_Inbox_Nav>
        <Header>
          <Title>Messages</Title>
          <My_Inbox_Write_To_Button />
        </Header>
        <Inbox_UserThread_List />
      </My_Inbox_Nav>

      {children}
    </>
  );
}

//

const Header = tw.header`
  mb-10
  flex
  flex-row
  justify-between
  px-8
`;

const Title = tw.h6`
  px-8
  text-2xl
  font-bold
`;
