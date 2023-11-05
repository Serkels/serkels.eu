//

import { Share_Button } from ":components/Share_Button";
import { slug_to_opportunity, type Params } from ":pipes/opportunity_slug";
import { Article, icon_link } from "@1.modules/opportunity.ui/Article";
import { Share } from "@1.ui/react/icons";
import type { Metadata, ResolvingMetadata } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import { notFound } from "next/navigation";

//

// import ReactMarkdown from "react-markdown";
const ReactMarkdown = dynamic<any>(() => import("react-markdown"));

//

export async function generateMetadata(
  { params }: { params: Params },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const opportunity = await slug_to_opportunity(params);
  const title = `${opportunity.title} :: ${(await parent).title?.absolute}`;

  return {
    title,
    openGraph: {
      title,
    },
  };
}

//

export default async function Page({ params }: { params: Params }) {
  try {
    const opportunity = await slug_to_opportunity(params);
    const { owner: partner } = opportunity;
    const { profile } = partner;

    return (
      <Article opportunity={opportunity}>
        <Article.Avatar>
          <Link href={`/@${profile.id}`}>
            <figure className="flex items-center">
              <img
                className="mr-4 block rounded-full"
                width="30"
                height="30"
                src={profile.image}
              />

              <figcaption className="text-lg">{profile.name}</figcaption>
            </figure>
          </Link>
        </Article.Avatar>
        <Article.Description>
          {({ description }) => <ReactMarkdown>{description}</ReactMarkdown>}
        </Article.Description>
        <Article.ShareFigure>
          <Share_Button
            href={`${process.env["APP_URL"]}/opportunities/${opportunity.slug}`}
          >
            <figure className="flex items-center">
              <Share className={icon_link()} />
              <figcaption className="ml-4 flex-1">Partager</figcaption>
            </figure>
          </Share_Button>
        </Article.ShareFigure>
      </Article>
    );
  } catch (error) {
    return notFound();
  }
}
