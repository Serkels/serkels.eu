//

import { Suspense } from "react";
import PageClient from "./page.client";

//

export const dynamic = "force-dynamic";

// export async function getStaticProps() {
//   // 👇 Fetch the posts from the database

//   const posts = await get_categories();

//   return {
//     props: {
//       posts,
//     },

//     // Next.js will attempt to re-generate the page:
//     // - When a request comes in
//     // - At most once every second
//     revalidate: 1,
//   };
// }

export default async function Page() {
  // const sdf = await get_categories();
  // sdf;
  // console.log({ sdf });
  return (
    <div>
      Page
      <Suspense fallback="loading...">
        <PageClient />
      </Suspense>
    </div>
  );
}
