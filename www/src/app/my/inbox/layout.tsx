///

import { InputSearch } from "@1/ui/components/InputSearch";
import type { PropsWithChildren } from "react";
import tw from "tailwind-styled-components";
import { Inbox_UserThread_List } from "./Inbox_UserThread_List";
import { My_Inbox_Nav } from "./My_Inbox_Nav";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <>
      <My_Inbox_Nav>
        <Header>
          <Title>Messages</Title>
        </Header>
        <form className="my-10" action="#">
          <InputSearch />
        </form>

        <Inbox_UserThread_List />
      </My_Inbox_Nav>
      {children}
    </>
  );
}

//

const Header = tw.header`
  my-10
  flex
  flex-row
  justify-between
`;

const Title = tw.h6`
  text-2xl
  font-bold
`;
