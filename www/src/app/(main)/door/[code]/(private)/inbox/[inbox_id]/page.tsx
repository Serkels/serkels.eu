//

import type { Metadata, ResolvingMetadata } from "next";
import tw from "tailwind-styled-components";
import {
  Inbox,
  Thread_Avatar,
  Thread_Conversation,
  Thread_Conversation_Form,
} from "./page.client";

//

export async function generateMetadata(
  { params }: { params: { inbox_id: string } },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  return {
    title: `Box@${params.inbox_id} :: ${(await parent).title?.absolute}`,
  };
}

//

export default async function Page({
  params,
}: {
  params: { inbox_id: string };
}) {
  const inbox_id = Number(params.inbox_id);

  return (
    <Main>
      <Sticky_Container>
        <Inbox id={inbox_id}>
          <Header>
            <Thread_Avatar />
          </Header>
          <Scrollable_Part>
            <Thread_Conversation />
          </Scrollable_Part>
          <Footer>
            <Thread_Conversation_Form />
          </Footer>
        </Inbox>
      </Sticky_Container>
    </Main>
  );
}

const Scrollable_Part = tw.div`
  -mr-6
  overflow-y-auto
  py-4
  pr-5
`;

const Sticky_Container = tw.div`
  sticky
  top-14
  m-auto
  grid
  h-[calc(100vh_-_theme(spacing.24))]
  grid-rows-[max-content_1fr_max-content]
  xl:max-w-[80%]
`;

const Main = tw.main`
  col-span-full
  bg-white
  text-black
  sm:mb-0
  md:col-span-4
  xl:col-span-6
  [&>*]:px-7
`;

const Header = tw.header`
  z-10
  flex
  flex-row
  justify-between
  space-x-3
  bg-white
  py-7
  text-black
`;

const Footer = tw.footer`
  z-10
  flex
  min-h-[110px]
  flex-col
  items-center
  justify-center
  space-y-4
  bg-white
  py-5
  text-black
`;
