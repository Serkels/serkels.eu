//

import prisma from "#prisma";
import { ProfileRole } from "#prisma/client";
import { faker_image_avatar } from "../helpers/faker_image_avatar";

//

export async function students() {
  const [category_autres] = await Promise.all([
    prisma.category.findFirstOrThrow({
      select: { id: true },
      where: { slug: "autres" },
    }),
  ]);
  const image = faker_image_avatar();
  const douglas = await prisma.profile.findFirstOrThrow({
    select: { id: true },
    where: { user: { email: "douglas@yopmail.com" } },
  });
  const jackie = await prisma.student.create({
    data: {
      language: "Français",
      city: "Paris",
      field_of_study: "Informatique",
      interest: {
        connect: [category_autres],
      },
      university: "Paris 1",
      //
      asked_questions: {
        createMany: {
          data: [
            {
              category_id: category_autres.id,
              title: "Comment faire une soupe ?",
              created_at: new Date(),
              updated_at: new Date(),
            },
          ],
        },
      },
      proposed_exchanges: {
        createMany: {
          data: [
            {
              category_id: category_autres.id,
              description: "J'aime le café",
              is_active: true,
              is_online: false,
              location: "Paris",
              places: 1,
              return_id: null,
              title: "P'tit pause café avec l'ami Jackie",
              type: "PROPOSAL",
            },
          ],
        },
      },
      profile: {
        create: {
          bio: "J'aime le café",
          image,
          name: "Jackie Smith",
          role: ProfileRole.STUDENT,
          in_contact_with: {
            connect: { id: douglas.id },
          },
          user: {
            create: {
              email: "jackie@yopmail.com",
              image,
              name: "Jackie",
            },
          },
        },
      },
    },
  });

  return { jackie };
}
