//

import tw from "tailwind-styled-components";
import {
  Inbox,
  Inbox_Provider,
  Thread_Avatar,
  Thread_Conversation,
  Thread_Conversation_Form,
  Thread_Provider,
} from "./page.client";

export default async function Page({
  params,
}: {
  params: { inbox_id: string };
}) {
  const inbox_id = Number(params.inbox_id);

  return (
    <Main>
      <Sticky_Container>
        <Inbox_Provider>
          <Thread_Provider>
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
          </Thread_Provider>
        </Inbox_Provider>
      </Sticky_Container>
    </Main>
  );
}

const Scrollable_Part = tw.main`
  overflow-y-auto
  py-4
  pr-5
`;

const Sticky_Container = tw.main`
  sticky
  top-14
  m-auto
  grid
  h-[calc(100vh_-_theme(spacing.24))]
  grid-rows-[max-content_1fr_max-content]
  md:max-w-[80%]
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
