//

import tw from "tailwind-styled-components";
import { Thread_Avatar } from "./(page)";
import { Thread_Provider } from "./Thread_Provider";

export default async function Page({
  params,
}: {
  params: { thread_id: string };
}) {
  const thread_id = Number(params.thread_id);

  return (
    <Main>
      <Thread_Provider id={thread_id}>
        <Header>
          <Thread_Avatar />
          {/* <Participant_Avatar />
        <NavControlGroup exchange_id={exchange_id} /> */}
        </Header>
        {/* <Deal_Provider id={deal_id}>

        <section className="overflow-y-auto py-4">
          <Deal_Discussion />
        </section>

        <footer className="sticky bottom-0 z-10 flex  min-h-[110px] flex-col items-center justify-center space-y-4 bg-white py-5 text-black">
          <Deal_Discussion_Form />
          <SendActionGroup />
        </footer>*/}
      </Thread_Provider>
    </Main>
  );
}

const Main = tw.main`
  col-span-full
  grid
  grid-rows-[max-content_1fr_max-content]
  bg-white
  text-black
  sm:mb-0
  md:col-span-4
  xl:col-span-6
  [&>*]:px-7
`;

const Header = tw.header`
  sticky
  top-14
  z-10
  flex
  flex-row
  justify-between
  space-x-3
  bg-white
  py-7
  text-black
`;
