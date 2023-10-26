//

import { slug_to_opportunity, type Params } from ":pipes/opportunity_slug";
import { Article } from "@1.modules/opportunity.ui/Article";
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
      </Article>
    );
  } catch (error) {
    return notFound();
  }
}
