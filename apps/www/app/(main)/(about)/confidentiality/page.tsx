//

import { SafeReactMarkdown } from ":components/markdown";
import { readFile } from "fs/promises";
import type { Metadata, ResolvingMetadata } from "next";
import { join } from "path";

//

const content = await readFile(
  join(process.cwd(), "app/(main)/(about)/confidentiality/content.md"),
  "utf8",
);

export async function generateMetadata(
  _: never,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const title = `Confidentiality :: ${(await parent).title?.absolute}`;

  return {
    title,
    openGraph: {
      title,
    },
  };
}

export default async function Page() {
  return (
    <main className="container prose mx-auto my-10 p-6 lg:prose-xl lg:max-w-[126ch]">
      <SafeReactMarkdown>{content}</SafeReactMarkdown>
    </main>
  );
}
