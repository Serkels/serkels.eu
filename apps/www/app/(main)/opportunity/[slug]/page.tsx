//

import { TRPC_SSR } from ":trpc/server";
import { Article } from "@1.modules/opportunity.ui/Article";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";

//

// import ReactMarkdown from "react-markdown";
const ReactMarkdown = dynamic<any>(() => import("react-markdown"));

//

export default async function Page({ params }: { params: { slug: string } }) {
  const { slug } = params;

  try {
    const opportunity = await TRPC_SSR.opportunity.by_slug.fetch(slug);

    return (
      <Article opportunity={opportunity}>
        <Article.Description>
          {({ description }) => <ReactMarkdown>{description}</ReactMarkdown>}
        </Article.Description>
      </Article>
    );
  } catch (error) {
    return notFound();
  }
}
