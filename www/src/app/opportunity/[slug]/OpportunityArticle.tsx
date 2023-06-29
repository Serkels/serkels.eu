"use client";

import { useOpportunity } from "@/app/opportunity/useOpportunity";
import { Spinner } from "@1/ui/components/Spinner";
import { Circle, Link as IconLink, LocationRadius, Share } from "@1/ui/icons";
import clsx from "clsx";
import type { ComponentPropsWithoutRef, ElementType } from "react";
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
  const date = expireAt ? new Date(expireAt) : new Date(NaN);
  const partner_name =
    partner?.data?.attributes?.name ?? "Partenaire Inconnu :(";
  const partner_avatar =
    partner?.data?.attributes?.avatar?.data?.attributes?.url ??
    `https://source.unsplash.com/random/16x16/?${partner_name}&${partner?.data?.id}`;
  return (
    <article className="px-4 py-10 lg:px-16">
      <h1 className="text-4xl font-bold">{title}</h1>

      <header className="flex items-center justify-between py-6">
        <figure className="flex items-center">
          <img
            className="mr-4 block rounded-full"
            width="30"
            height="30"
            src={partner_avatar}
          />
          <figcaption className="text-lg">{partner_name}</figcaption>
        </figure>
        <small className="text-lg font-bold text-Chateau_Green">
          Date limite :{" "}
          <time dateTime={date.toUTCString()}>
            {date.toLocaleDateString(locale)}
          </time>
        </small>
      </header>

      <div className="mb-10">
        <ReactMarkdown
          className="
            [&_h1]:my-2 [&_h1]:text-2xl
            [&_h2]:my-2 [&_h2]:text-xl
            [&_h3]:my-2 [&_h3]:text-lg
            [&_h4]:my-2 [&_h4]:text-lg
            [&_ul]:m-1 [&_ul]:list-disc [&_ul]:px-4
          "
        >
          {description}
        </ReactMarkdown>
      </div>

      <footer className="grid grid-cols-3 items-center justify-items-center">
        <a
          href={`https://www.openstreetmap.org/search?query=${location}`}
          target="_blank"
          rel="noreferrer"
        >
          <figure className="flex items-center">
            <IconWithBgCircle className="basis-[30px]" Icon={LocationRadius} />
            <figcaption className="ml-4 flex-1">{location}</figcaption>
          </figure>
        </a>

        <a href={link} target="_blank" rel="noreferrer">
          <figure className="flex items-center">
            <IconWithBgCircle className="basis-[30px]" Icon={IconLink} />
            <figcaption className="ml-4 flex-1">Lien web</figcaption>
          </figure>
        </a>

        <figure className="flex items-center">
          <IconWithBgCircle className="h-[30px] basis-[30px]" Icon={Share} />
          <figcaption className="ml-4 flex-1">Partager</figcaption>
        </figure>
      </footer>
    </article>
  );
}

function IconWithBgCircle({
  className,
  Icon,
}: ComponentPropsWithoutRef<"span"> & {
  Icon: ElementType;
}) {
  return (
    <span className={clsx("relative ", className)}>
      <Circle className="h-full text-Cerulean" />
      <Icon className="absolute inset-0 z-10 box-content p-1.5 text-white" />
    </span>
  );
}
