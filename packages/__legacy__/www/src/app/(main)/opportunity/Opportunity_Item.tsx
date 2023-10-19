//

import type { Opportunity } from "@1/modules/opportunity/domain";
import Link from "next/link";
import tw from "tailwind-styled-components";
import { OpportunityCard } from "./OpportunityCard";

export const Opportunity_Grid = tw.ul`
  grid
  grid-flow-row
  grid-cols-1
  gap-8
  px-4
  sm:grid-cols-2
  sm:px-0
  md:grid-cols-2
  lg:grid-cols-3
  xl:grid-cols-4
`;

export function Opportunity_Item({
  opportunity,
}: {
  opportunity: Opportunity;
}) {
  return (
    <Link className="h-full" href={`/opportunity/${opportunity.get("slug")}`}>
      <OpportunityCard
        className="h-full"
        cover={opportunity.get("cover")}
        expireAt={opportunity.get("expireAt").toString()}
        id={String(opportunity.get("id"))}
        location={opportunity.get("location")}
        category={opportunity.get("category")}
        partner={opportunity.get("partner")}
        title={opportunity.get("title")}
      />
    </Link>
  );
}
