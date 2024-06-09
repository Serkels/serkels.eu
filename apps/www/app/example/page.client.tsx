"use client";

import get_categories from "@1.modules/category.api/get_categories";
import { useQuery } from "@tanstack/react-query";

//

const query_category = () => {
  return useQuery({
    queryKey: ["use_category"],
    queryFn: async () => {
      return get_categories();
    },
  });
};
// export const getStaticProps: GetStaticProps = async () => {
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
// };
export default function PageClient() {
  const { data, isError, isLoading } = query_category();
  return <pre>{JSON.stringify({ isError, isLoading, data }, null, 2)}</pre>;
}
