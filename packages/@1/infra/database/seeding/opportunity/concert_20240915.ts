//

import { PrismaClient } from "../../prisma-client";

//

export function create_concert_20240915(
  prisma: PrismaClient,
  partner_id: string,
) {
  return prisma.opportunity.create({
    data: {
      category: { connect: { id: "masterclass_category_id" } },
      cover: "https://picsum.photos/600/400",
      created_at: new Date("2011-11-11"),
      description: "https://vulf.co/courses/dart/lectures/45940163",
      expiry_date: new Date("2024-09-15"),
      id: "concert_20240915",
      link: "https://www.whalerockmusicfestival.com/",
      location: "Castoro Cellars Vineyards & Winery",
      owner: { connect: { id: partner_id } },
      slug: "whale-rock-festival-2024",
      title: "WHALE ROCK FESTIVAL ",
      updated_at: new Date("2011-11-11"),
    },
  });
}
