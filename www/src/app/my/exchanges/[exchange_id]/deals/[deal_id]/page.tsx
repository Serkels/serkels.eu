//

import { Deal_Provider } from "../Deal_Provider";
import { Deal_Discussion } from "./Deal_Discussion";
import { Deal_Discussion_Form } from "./Deal_Discussion_Form";
import { NavControlGroup } from "./NavControlGroup";
import { Participant_Avatar } from "./Participant_Avatar";
import { SendActionGroup } from "./SendActionGroup";

//

export default async function Page({
  params,
}: {
  params: { exchange_id: string; deal_id: string };
}) {
  const exchange_id = Number(params.exchange_id);
  const deal_id = Number(params.deal_id);

  return (
    <main className="col-span-full grid grid-rows-[max-content_1fr_max-content] bg-white  text-black sm:mb-0 md:col-span-2 xl:col-span-3 [&>*]:px-7">
      <Deal_Provider id={deal_id}>
        <header className="sticky top-14 z-10 flex flex-row justify-between space-x-3 bg-white py-7 text-black">
          <Participant_Avatar />
          <NavControlGroup exchange_id={exchange_id} />
        </header>

        <section className="overflow-y-auto py-4">
          <Deal_Discussion />
        </section>

        <footer className="sticky bottom-0 z-10 flex  min-h-[110px] flex-col items-center justify-center space-y-4 bg-white py-5 text-black">
          <Deal_Discussion_Form />
          <SendActionGroup />
        </footer>
      </Deal_Provider>
    </main>
  );
}
