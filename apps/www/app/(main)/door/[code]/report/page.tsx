//

import { getServerSession } from "@1.modules/auth.next.legacy";
import type { Metadata, ResolvingMetadata } from "next";
import { ReportForm, ReportForm_Provider } from "./page.client";

//

export async function generateMetadata(
  _: never,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const title = `Report :: ${(await parent).title?.absolute}`;

  return {
    title,
    openGraph: {
      title,
    },
  };
}

//

export default async function Page() {
  const session = await getServerSession();
  if (!session) return null;
  if (!session.user) return null;

  const { email } = session.user;
  if (!email) return null;

  return (
    <main className="container my-32 px-16">
      <h1 className="mb-8 text-4xl font-bold">Signalement</h1>
      <ReportForm_Provider value={{ email }}>
        <ReportForm />
      </ReportForm_Provider>
    </main>
  );
}
