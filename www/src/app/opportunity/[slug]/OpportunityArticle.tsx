"use client";

import { useOpportunity } from "@/app/opportunity/useOpportunity";
import { Spinner } from "@1/ui/components/Spinner";
import ReactMarkdown from "react-markdown";

//

export function OpportunityArticle(props: { slug: string; initialData: any }) {
  const { slug, initialData } = props;
  const { data, isLoading, isError } = useOpportunity(slug, { initialData });

  if (isLoading) return <Spinner />;
  if (isError) return <>Epic fail...</>;
  if (!data) return <>No data O_o</>;
  if (!data.attributes) return <>No data O_o</>;

  const { expireAt, title, partner, locale, description, location, link } =
    data.attributes;
  const partner_name =
    partner?.data?.attributes?.name ?? "Partenaire Inconnu :(";
  const date = expireAt ? new Date(expireAt) : new Date(NaN);
  return (
    <article className="px-20 py-10">
      <h1 className="text-3xl font-bold">{title}</h1>

      <header className="flex items-center justify-between py-4">
        <figure className="flex items-center">
          <img
            className="mr-4 block rounded-full"
            width="30"
            height="30"
            src="https://source.unsplash.com/random/30x30/?school"
          />
          <figcaption>{partner_name}</figcaption>
        </figure>
        <small className="font-bold text-Chateau_Green">
          Date limite :{" "}
          <time dateTime={date.toUTCString()}>
            {date.toLocaleDateString(locale)}
          </time>
        </small>
      </header>

      <div className="mb-10">
        <ReactMarkdown className="[&_ul]:m-1 [&_ul]:list-disc [&_ul]:px-4">
          {description}
        </ReactMarkdown>
      </div>

      <footer className="flex justify-between">
        <a
          href={`https://www.openstreetmap.org/directions?to=${location}`}
          target="_blank"
          rel="noreferrer"
        >
          <figure className="flex items-center">
            <img
              className="mr-4 h-8 w-8 rounded-full"
              width="30"
              height="30"
              src="https://source.unsplash.com/random/30x30/?paris"
            />
            <figcaption>{location}</figcaption>
          </figure>
        </a>

        <a href={link} target="_blank" rel="noreferrer">
          <figure className="flex items-center">
            <img
              className="mr-4 h-8 w-8  rounded-full"
              src="https://source.unsplash.com/random/30x30/?lien web"
            />
            <figcaption>Lien web</figcaption>
          </figure>
        </a>

        <figure className="flex items-center">
          <img
            className="mr-4 h-8 w-8  rounded-full"
            src="https://source.unsplash.com/random/30x30/?partager"
          />
          <figcaption>Partager</figcaption>
        </figure>
      </footer>
    </article>
  );
}
