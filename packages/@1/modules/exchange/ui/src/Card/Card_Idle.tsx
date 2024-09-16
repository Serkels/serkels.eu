//

import { AvatarMedia } from "@1.ui/react/avatar";
import { ExclamationMark, School, Share } from "@1.ui/react/icons";
import { ActionItem, Menu } from "@1.ui/react/menu";
import { type PropsWithChildren } from "react";
import { tv } from "tailwind-variants";
import { Card } from "./Card";
import { Publish_Date } from "./Date";
import { InfoBar } from "./InfoBar";
import { useExchange, useExchangeMeta } from "./context";
import { exchange_card } from "./exchange_card";

//

export function Card_Idle({ children }: PropsWithChildren) {
  const exchange = useExchange();
  const { base, body } = exchange_card();
  const { footer, header } = exchange_card({
    type: exchange.type,
  });
  const { title, description } = exchange;
  const { is_yours } = useExchangeMeta();
  const { withEdit, classic } = style();

  return (
    <div id={exchange.id} className={base()}>
      <div className={body()}>
        <header className={header()}>
          <Card.Header.Left.Renderer childs={children}>
            <AvatarMedia name="Unknow user" image="/opengraph-image.png">
              <AvatarMedia.SubTitle>
                <School className="mr-1.5 inline-block w-6" />
                <span>{exchange.owner.university}</span>
              </AvatarMedia.SubTitle>
            </AvatarMedia>
          </Card.Header.Left.Renderer>
          <Card.Header.Center.Renderer childs={children}>
            <div>
              <figure className="flex flex-col items-end md:items-center ">
                <div className="text-xl font-bold text-primary">
                  {`${exchange.deals.length} / ${exchange.places}`}
                </div>
                <figcaption className="text-center text-sm">
                  participant{exchange.places > 1 ? "s" : ""}
                </figcaption>
              </figure>
            </div>
          </Card.Header.Center.Renderer>
          <div className="hidden items-start justify-end space-x-2 text-xs md:flex">
            <Card.Header.Right.Renderer
              childs={children}
            ></Card.Header.Right.Renderer>
          </div>
        </header>

        <hr className="my-2" />

        <InfoBar />

        <hr className="my-2" />

        <article>
          <h3 className="my-4 break-words text-2xl font-bold">
            <div className="float-right">
              <ExchangeMenu exchange_id={exchange.id} />
            </div>

            {title}
          </h3>
          <Card.Body.Renderer childs={children}>
            <p>{description}</p>
          </Card.Body.Renderer>
        </article>
        <Publish_Date />
      </div>
      <footer className={footer()}>
        <div className="col-span-1 justify-self-start">
          <Card.Footer.Left.Renderer childs={children}>
            ...
          </Card.Footer.Left.Renderer>
        </div>
        <div className=" col-span-4 col-start-2 justify-self-center md:col-span-2 md:col-start-3">
          <Card.Footer.Center.Renderer childs={children}>
            ...
          </Card.Footer.Center.Renderer>
        </div>
        <div className={is_yours ? withEdit() : classic()}>
          <Card.Footer.Right.Renderer childs={children}>
            <Share className="size-5" />
          </Card.Footer.Right.Renderer>
        </div>
      </footer>
    </div>
  );
}

export function ExchangeMenu({ exchange_id }: { exchange_id: string }) {
  const href = `/exchanges/${exchange_id}`;

  return (
    <Menu>
      <ActionItem
        className="flex items-center space-x-1 whitespace-nowrap"
        href={`/@~/report?${new URLSearchParams({ url: href })}`}
      >
        <ExclamationMark className="h-4" /> <span>Signaler l'échange</span>
      </ActionItem>
    </Menu>
  );
}

const style = tv({
  base: "",
  slots: {
    withEdit: "col-start-6 columns-3 items-center gap-4 justify-self-end",
    classic: "col-start-6 justify-self-end",
  },
});
