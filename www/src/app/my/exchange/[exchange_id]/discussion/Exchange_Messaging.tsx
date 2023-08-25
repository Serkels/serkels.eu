"use client";

import { AsideBar } from "@/layouts/holy/aside";
import { UnknownError } from "@1/core/error";
import {
  Exchange_DiscussionSchemaToDomain,
  Exchange_ItemSchemaToDomain,
} from "@1/modules/exchange/infra/strapi";
import { Button } from "@1/ui/components/ButtonV";
import { Spinner } from "@1/ui/components/Spinner";
import { Circle } from "@1/ui/icons";
import clsx from "clsx";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type ComponentPropsWithoutRef } from "react";
import tw from "tailwind-styled-components";
import { P, match } from "ts-pattern";
import { fromClient } from "~/app/api/v1";
import { AvatarMediaHorizontal } from "~/components/Avatar";
import { ErrorOccur } from "~/components/ErrorOccur";
import { Exchange_Item_Controller } from "~/modules/exchange/Item.controller";
import { Exchange_Repository } from "~/modules/exchange/infrastructure";
import {
  Exchange_ValueProvider,
  useExchange_Value,
} from "../../Exchange.context";
import {
  Discussion_ValueProvider,
  useDiscussion_Value,
} from "./Discussion.context";

//

export function Exchange_Messaging({ exchange_id }: { exchange_id: number }) {
  const { data: session } = useSession();
  const repository = new Exchange_Repository(fromClient, session?.user?.jwt);
  const {
    item: { useQuery },
  } = new Exchange_Item_Controller(repository);

  const query_info = useQuery(exchange_id);

  return match(query_info)
    .with({ status: "error" }, ({ error }) => (
      <ErrorOccur error={error as Error} />
    ))
    .with({ status: "loading" }, () => <Spinner />)
    .with(
      {
        status: "success",
        data: P.not(P.nullish),
      },
      ({ data }) => {
        const r_exchange = new Exchange_ItemSchemaToDomain().build(data);
        if (r_exchange.isFail()) {
          console.error(r_exchange.error());
          return null;
        }

        const exchange = r_exchange.value();
        return (
          <Exchange_ValueProvider initialValue={exchange}>
            <Messaging_Header>
              <h6
                className="line-clamp-2 flex-1 text-xl font-bold"
                title={exchange.title}
              >
                {exchange.title}
              </h6>
              <button>...</button>
            </Messaging_Header>
            <Diviser />
            <Echange_DiscussionNav />
          </Exchange_ValueProvider>
        );
      },
    )
    .with({ status: "success" }, () => (
      <ErrorOccur
        error={new UnknownError("useQuery Success with nullish data")}
      />
    ))
    .exhaustive();
}

export function Echange_DiscussionNav() {
  const [exchange] = useExchange_Value();
  const { data: session } = useSession();
  const repository = new Exchange_Repository(fromClient, session?.user?.jwt);
  const {
    discussions: { useQuery },
  } = new Exchange_Item_Controller(repository);

  return match(useQuery(exchange.get("id")))
    .with({ status: "error" }, ({ error }) => (
      <ErrorOccur error={error as Error} />
    ))
    .with({ status: "loading" }, () => <Loading />)
    .with(
      {
        status: "success",
        data: P.when(
          (list) => list.pages.map((page) => page.data!).flat().length === 0,
        ),
      },
      () => <EmptyList />,
    )
    .with(
      { status: "success" },
      ({ data: { pages }, isFetchingNextPage, hasNextPage, fetchNextPage }) => (
        <nav>
          <ul className="space-y-5">
            {pages
              .map((page) => page.data!)
              .flat()
              .map((raw) => new Exchange_DiscussionSchemaToDomain().build(raw))
              .filter((result) => {
                if (result.isFail()) {
                  console.error(result.error());
                }
                return result.isOk();
              })
              .map((result) => result.value())
              .map((discussion) => (
                <li key={discussion.get("id")}>
                  <Discussion_ValueProvider initialValue={discussion}>
                    <Echange_DiscussionLink />
                  </Discussion_ValueProvider>
                </li>
              ))}
            {isFetchingNextPage ? (
              <li className="col-span-full mx-auto">
                <Loading />
              </li>
            ) : null}
            {hasNextPage ? (
              <li className="col-span-full mx-auto">
                <Button
                  onPress={() => fetchNextPage()}
                  isDisabled={!hasNextPage || isFetchingNextPage}
                >
                  Charger plus
                </Button>
              </li>
            ) : null}
          </ul>
        </nav>
      ),
    )
    .exhaustive();
}

function Echange_DiscussionLink() {
  const [exchange] = useExchange_Value();
  const [discussion] = useDiscussion_Value();
  const pathname = usePathname();

  const href = `/my/exchange/${exchange.get("id")}/discussion/${discussion.get(
    "id",
  )}`;
  const active =
    pathname.split("/").length >= href.split("/").length &&
    href.includes(pathname);

  return (
    <Link
      href={href}
      className={clsx(
        `
          block
          rounded-xl
          border
          border-[#ECEDF4]
          p-4
          text-black
          shadow-[10px_10px_10px_#00000014]
        `,
        { " bg-white": active },
      )}
    >
      <Echange_DiscussionLink.ui.header>
        <AvatarMediaHorizontal
          u="1"
          username={discussion.profile.name}
          university="Voir le profil"
        />
        <Echange_DiscussionLink.ui.time
          dateTime={discussion.updated_at.toUTCString()}
          title={discussion.updated_at.toUTCString()}
        >
          {discussion.last_update}
        </Echange_DiscussionLink.ui.time>
      </Echange_DiscussionLink.ui.header>
      <div className="relative my-5">
        <div className="float-right">
          <Circle className="h-5 w-5 text-Gamboge" />
        </div>
        <p className="mb-1 line-clamp-1" title={discussion.last_message}>
          {discussion.last_message}
        </p>
      </div>
    </Link>
  );
}

Echange_DiscussionLink.ui = {
  header: tw.header`
  flex
  justify-between
`,
  time: tw.time`
  text-xs
  font-bold
`,
};

export function AsideNav_(props: ComponentPropsWithoutRef<"aside">) {
  const { children, ...other_props } = props;
  // const [exchange] = useExchange_Value();
  // console.log({ exchange });
  const pathname = usePathname();
  const thread = [{ id: 42, active: true }, { id: 4242 }, { id: 424242 }];
  return (
    <AsideBar {...other_props}>
      <div className="sticky top-[calc(66px_+_24px)]">
        <h1 className="text-xl font-bold">Cours de français tout les niveau</h1>

        <hr className="my-6 border-2 border-[#F0F0F0]" />

        <ul className="space-y-5">
          {thread.map((thread) => (
            <li key={thread.id}>
              <Link
                href={`${pathname}/${thread.id}`}
                className={clsx(
                  `
                  block
                  rounded-xl
                  border
                  border-[#ECEDF4]
                  p-4
                  text-black
                  shadow-[10px_10px_10px_#00000014]
                  `,
                  { "bg-white": thread.active },
                )}
              ></Link>
            </li>
          ))}
        </ul>
      </div>
    </AsideBar>
  );
}

function EmptyList() {
  return (
    <EmptyList.ui.p>Aucune discussion disponible pour le moment</EmptyList.ui.p>
  );
}

EmptyList.ui = {
  p: tw.p`
  content-[Aucune
  discussion
  disponible
  pour
  le
  moment]
  flex
  h-1/3
  flex-col
  items-center
  justify-center
  text-center
  font-bold
  opacity-50
`,
};

function Loading() {
  return (
    <Loading.ui.figure>
      <Spinner />
    </Loading.ui.figure>
  );
}

Loading.ui = {
  figure: tw.figure`
  mt-28
  text-center
`,
};

const Diviser = tw.hr`
  my-6
  border-2
  border-[#F0F0F0]
`;

const Messaging_Header = tw.header`
  mt-6
  flex
  h-16
  items-center
  justify-start
  space-x-7
`;
