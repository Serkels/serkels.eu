//

import { readFile } from "fs/promises";
import type { Metadata, ResolvingMetadata } from "next";
import dynamic from "next/dynamic";
import { join } from "path";

//

const ReactMarkdown = dynamic<any>(() => import("react-markdown"));

const content = await readFile(
  join(process.cwd(), "app/(main)/(about)/moderation/content.md"),
  "utf8",
);

export async function generateMetadata(
  _: never,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const title = `Moderation Rules :: ${(await parent).title?.absolute}`;

  return {
    title,
    openGraph: {
      title,
    },
  };
}

export default function Page() {
  return (
    <main className="container prose mx-auto my-10 p-6 lg:prose-xl lg:max-w-[126ch]">
      <ReactMarkdown>{content}</ReactMarkdown>
    </main>
  );
}
