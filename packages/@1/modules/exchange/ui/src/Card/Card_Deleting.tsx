import { AvatarMedia } from "@1.ui/react/avatar";
import { School } from "@1.ui/react/icons";
import { type PropsWithChildren } from "react";
import { Card } from "./Card";
import { Exchange_Date } from "./Date";
import { InfoBar } from "./InfoBar";
import { useExchange } from "./context";
import { exchange_card } from "./exchange_card";

export function Card_Deleting({ children }: PropsWithChildren) {
  const exchange = useExchange();
  const { base, body } = exchange_card();
  const { footer, header } = exchange_card({ type: exchange.type });
  const { title, description } = exchange;

  return (
    <div id={exchange.id} className={base({ className: "opacity-40" })}>
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
              <figure className="flex flex-col items-center">
                <div className="text-xl font-bold text-primary">
                  {`${exchange.deals.length} / ${exchange.places}`}
                </div>
                <figcaption>
                  participant{exchange.places > 1 ? "s" : ""}
                </figcaption>
              </figure>
            </div>
          </Card.Header.Center.Renderer>
          <div className="flex items-start justify-end space-x-2">
            <Exchange_Date />
          </div>
        </header>

        <hr className="my-2" />

        <InfoBar />

        <hr className="my-2" />

        <article>
          <h3 className="my-5 break-words text-2xl font-bold">{title}</h3>
          <p>{description}</p>
        </article>
      </div>
      <footer className={footer()}>
        <div className="flex justify-center">
          <div>Suppression en cours...</div>
        </div>
      </footer>
    </div>
  );
}
