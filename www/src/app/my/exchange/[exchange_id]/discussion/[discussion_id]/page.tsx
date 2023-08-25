//

import { AvatarMediaHorizontal } from "~/components/Avatar";
import { NavControlGroup } from "./NavControlGroup";
import { SendActionGroup } from "./SendActionGroup";

//

export default async function Page({
  params,
}: {
  params: { exchange_id: string; discussion_id: string };
}) {
  const exchange_id = Number(params.exchange_id);
  const discussion_id = Number(params.discussion_id);
  // console.log({ exchange_id, discussion_id });

  return (
    <main className="col-span-full mb-5 grid grid-rows-[max-content_1fr_max-content] bg-white py-7 text-black sm:mb-0 md:col-span-2 xl:col-span-3 [&>*]:px-7">
      <header className="flex flex-row justify-between space-x-3">
        <AvatarMediaHorizontal
          u="1"
          username={"Yasmin Belamine"}
          university="Voir le profil"
        />
        <NavControlGroup
          exchange_id={exchange_id}
          discussion_id={discussion_id}
        />
      </header>

      <section className="overflow-y-auto py-4">
        <time
          className="block p-4 text-center text-sm text-gray-500"
          dateTime={""}
          title={""}
        >
          12/10/2023 08:45 PM
        </time>

        <div className="flex flex-row mb-4 justify-start">
          <div className="relative mr-4 flex h-8 w-8 flex-shrink-0">
            <img
              className="h-3xl w-3xl rounded-3xl object-cover shadow-md"
              src="https://randomuser.me/api/portraits/women/33.jpg"
              alt=""
            />
          </div>
          <div className="messages grid grid-flow-row gap-2 text-sm text-gray-700">
            <div className="group flex items-center">
              <p className="max-w-[85%] rounded-r-3xl rounded-t-3xl bg-gray-100 px-6 py-3 ">
                Hey! How are you?
              </p>
            </div>
            <div className="group flex items-center">
              <p className="max-w-[85%] rounded-r-3xl bg-gray-100 px-6 py-3 ">
                Shall we go for Hiking this weekend?
              </p>
            </div>
            <div className="group flex items-center">
              <p className="max-w-[85%] rounded-b-3xl rounded-r-3xl bg-gray-100 px-6 py-3 ">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
                Volutpat lacus laoreet non curabitur gravida.
              </p>
            </div>
            <div className="group flex items-center">
              <p className="max-w-[85%] rounded-b-3xl rounded-r-3xl bg-gray-100 px-6 py-3 ">
                Bonjour ! Je veux bien apprendre le français avec toi !
              </p>
            </div>
          </div>
        </div>

        <time
          className="block p-4 text-center text-sm text-gray-500"
          dateTime={"13/10/2023 09:36 PM"}
          title={"13/10/2023 09:36 PM"}
        >
          13/10/2023 09:36 PM
        </time>

        <div className="flex flex-row mb-4 justify-start">
          <div className="relative mr-4 flex h-8 w-8 flex-shrink-0">
            <img
              className="h-3xl w-3xl rounded-3xl object-cover shadow-md"
              src="https://randomuser.me/api/portraits/women/33.jpg"
              alt=""
            />
          </div>
          <div className="messages grid grid-flow-row gap-2 text-sm text-gray-700">
            <div className="group flex items-center">
              <p className="max-w-[85%] rounded-r-3xl rounded-t-3xl bg-gray-100 px-6 py-3 ">
                Hey! How are you?
              </p>
            </div>
            <div className="group flex items-center">
              <p className="max-w-[85%] rounded-r-3xl bg-gray-100 px-6 py-3 ">
                Shall we go for Hiking this weekend?
              </p>
            </div>
            <div className="group flex items-center">
              <p className="max-w-[85%] rounded-b-3xl rounded-r-3xl bg-gray-100 px-6 py-3 ">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
                Volutpat lacus laoreet non curabitur gravida.
              </p>
            </div>
            <div className="group flex items-center">
              <p className="max-w-[85%] rounded-b-3xl rounded-r-3xl bg-gray-100 px-6 py-3 ">
                Bonjour ! Je veux bien apprendre le français avec toi !
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-row mb-4 justify-end">
          <div className="messages grid grid-flow-row gap-2 text-sm text-white">
            <div className="group flex flex-row-reverse items-center">
              <p className="max-w-[85%] rounded-l-3xl rounded-t-3xl bg-blue-500 px-6 py-3 ">
                Hey! How are you?
              </p>
            </div>
            <div className="group flex flex-row-reverse items-center">
              <p className="max-w-[85%] rounded-l-3xl bg-blue-500 px-6 py-3 ">
                Shall we go for Hiking this weekend?
              </p>
            </div>
            <div className="group flex flex-row-reverse items-center">
              <p className="max-w-[85%]  rounded-b-3xl rounded-l-3xl bg-blue-500 px-8 py-3  ">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
                Volutpat lacus laoreet non curabitur gravida.
              </p>
            </div>
          </div>

          <div className="relative ml-4 flex h-8 w-8 flex-shrink-0">
            <img
              className="h-3xl w-3xl rounded-3xl object-cover shadow-md"
              src="https://randomuser.me/api/portraits/women/33.jpg"
              alt=""
            />
          </div>
        </div>
      </section>

      <footer className="flex min-h-[110px] flex-col items-center justify-center space-y-4">
        <input
          type="text"
          className="block w-full xl:max-w-[400px] rounded-2xl border border-[#33333333] px-4 py-3 text-sm"
          placeholder="Envoie un Message…"
        />
        <SendActionGroup />
      </footer>
    </main>
  );
  // return (
  //   <>
  //     <Discussion_Header />
  //     <Discussion_NavArrow />
  //     <Discussion_Body />
  //     <Discussion_Action />
  //   </>
  // );
}

// function Discussion_Header() {
//   return null;
// }

// function Discussion_NavArrow() {
//   return null;
// }

// function Discussion_Body() {
//   return null;
// }
// function Discussion_Action() {
//   return null;
// }

//

// function Empty() {
//   return (
//     <figure className="flex h-3xl items-center justify-center">
//       <Image
//         src="/toc-toc.svg"
//         alt="Toc Toc Logo"
//         width={190}
//         height={53}
//         priority
//       />
//       <figcaption></figcaption>
//     </figure>
//   );
// }
