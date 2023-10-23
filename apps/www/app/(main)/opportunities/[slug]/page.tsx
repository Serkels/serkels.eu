//

import { TRPC_SSR } from ":trpc/server";
import { Article } from "@1.modules/opportunity.ui/Article";
import dynamic from "next/dynamic";
import Link from "next/link";
import { notFound } from "next/navigation";

//

// import ReactMarkdown from "react-markdown";
const ReactMarkdown = dynamic<any>(() => import("react-markdown"));

//

export default async function Page({ params }: { params: { slug: string } }) {
  const { slug } = params;

  try {
    const opportunity = await TRPC_SSR.opportunity.by_slug.fetch(slug);
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
