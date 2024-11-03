//

import { readFile } from "fs/promises";
import type { Metadata, ResolvingMetadata } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import { join } from "path";
import type { ReactNode } from "react";
import { tv } from "tailwind-variants";

//

const ReactMarkdown = dynamic<any>(() => import("react-markdown"));

const content = await readFile(
  join(process.cwd(), "app/(main)/(about)/legal/content.md"),
  "utf8",
);

export async function generateMetadata(
  _: never,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const title = `Legal :: ${(await parent).title?.absolute}`;

  return {
    title,
    openGraph: {
      title,
    },
  };
}

export default function Page() {
  const { link } = markdownLinkcss();

  const MarkdownLink = ({
    href,
    children,
  }: {
    href: string;
    children: ReactNode;
  }) => {
    if (href.startsWith("/")) {
      return (
        <Link href={href} passHref className={link()}>
          {children}
        </Link>
      );
    }
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  };

  return (
    <main className="container prose mx-auto my-10 p-6 lg:prose-xl">
      <ReactMarkdown components={{ a: MarkdownLink }}>{content}</ReactMarkdown>
    </main>
  );
}

const markdownLinkcss = tv({
  base: "",
  slots: {
    link: "underline-offset-8 hover:text-secondary ",
  },
});
