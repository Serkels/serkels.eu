//

import { Opportunity } from "@/api/Opportunity";
import { client } from "@/api/client";
import { AppBar } from "@1/ui/shell";
import { useQuery, type QueryClient } from "@tanstack/react-query";
import { OpportunityCard } from "./OpportunityCard";

//

export const prefetchQueries: Array<Parameters<QueryClient["prefetchQuery"]>> =
  [[["opportunities", 10], fetcher]];

export function Page() {
  return (
    <>
      <AppBar />
      Page Opportunity
    </>
  );
}

//

async function fetcher() {
  const { data, error } = await client.get("/opportunities", {
    params: { query: {} },
  });
  if (error) throw error;
  if (!data || !data.data) return [];
  return data.data.map((op) => Opportunity(op));
}

function OpportunityCardDeck() {
  const { data, isLoading, isSuccess } = useQuery({
    queryKey: ["opportunities", 10],
    queryFn: fetcher,
  });

  if (isLoading) return <aside>⚡ Fetching ⚡</aside>;
  if (!isSuccess) return <aside>Un error occurred 💀</aside>;
  if (data.length === 0) return <aside>Nothing for now 👀</aside>;

  return (
    <aside
      un-grid="~ cols-1 flow-row"
      un-gap="xl"
      un-px="xl"
      un-sm-px="0"
      un-sm-grid="cols-2"
      un-md-grid="cols-3"
      un-lg-grid="cols-4"
      un-xl-grid="cols-5"
    >
      {data.map((opportunity, key) => (
        <OpportunityCard key={key} {...opportunity} />
      ))}
    </aside>
  );
}
