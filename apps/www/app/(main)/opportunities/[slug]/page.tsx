//

import { ReactMarkdown } from ":components/markdown";
import { Share_Button } from ":components/Share_Button";
import { slug_to_opportunity, type Params } from ":pipes/opportunity_slug";
import { auth } from "@1.modules/auth.next";
import { Article, icon_link } from "@1.modules/opportunity.ui/Article";
import { ExclamationMark, Share } from "@1.ui/react/icons";
import { ActionItem, Menu } from "@1.ui/react/menu";
import to from "await-to-js";
import type { Metadata, ResolvingMetadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Opportunity_Delete_Button } from "./delete";

//

export async function generateMetadata(
  props: { params: Promise<Params> },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const params = await props.params;
  const [, opportunity] = await to(slug_to_opportunity(params));

  const title = `${opportunity?.title ?? "O_0"} :: ${(await parent).title?.absolute}`;

  return {
    title,
    openGraph: {
      title,
    },
  };
}

//

export default async function Page(props: { params: Promise<Params> }) {
  const params = await props.params;
  const session = await auth();

  try {
    const opportunity = await slug_to_opportunity(params);
    const {
      category,
      id: opportunity_id,
      owner: { profile },
      slug,
    } = opportunity;

    const is_yours = profile.id === session?.profile.id;
    const href_searhparams = new URLSearchParams({ category: category.slug });
    const href = `/opportunities/${slug}?${href_searhparams}`;

    return (
      <Article opportunity={opportunity}>
        {is_yours ? (
          <Article.ActionButton>
            <div className="flex">
              <Opportunity_Delete_Button opportunity_id={opportunity_id} />
            </div>
          </Article.ActionButton>
        ) : (
          <></>
        )}
        {session ? (
          <Article.Drawer>
            <div className="self-end">
              <OpportunityMenu category_slug={category.slug} slug={slug} />
            </div>
          </Article.Drawer>
        ) : (
          <></>
        )}
        <Article.Avatar>
          <Link href={`/@${profile.id}`}>
            <figure className="flex items-center">
              <img
                className="mr-4 block h-10 w-10 rounded-full"
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
          <Share_Button href={href}>
            <figure className="flex flex-col items-center gap-2 md:flex-row md:gap-0">
              <Share className={icon_link()} />
              <figcaption className="flex-1 md:ml-4">Partager</figcaption>
            </figure>
          </Share_Button>
        </Article.ShareFigure>
      </Article>
    );
  } catch (error) {
    console.error(error);
    return notFound();
  }
}

//

function OpportunityMenu({
  slug,
  category_slug,
}: {
  slug: string;
  category_slug: string;
}) {
  const href_searhparams = new URLSearchParams({ category: category_slug });
  const href = `/opportunities/${slug}?${href_searhparams}`;

  return (
    <Menu>
      <ActionItem
        className="flex items-center space-x-1 whitespace-nowrap"
        href={`/@~/report?${new URLSearchParams({ url: href })}`}
      >
        <ExclamationMark className="h-4" /> <span>Signaler l'oppotunité</span>
      </ActionItem>
    </Menu>
  );
}
