/**
 * Adds seed data to your db
 *
 * @link https://www.prisma.io/docs/guides/database/seed-database
 */
import { faker } from "@faker-js/faker";
import { CategoryContext, ProfileRole } from "@prisma/client";
import process from "node:process";
import slugify from "slugify";
import prisma from "../index";

async function main() {
  await prisma.user.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.studient.deleteMany();
  await prisma.exchange.deleteMany();

  await prisma.category.deleteMany();

  //

  await categories();

  await studients();
  await partners();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

//
//
//

async function studient() {
  const { image, name } = {
    image: faker.image.avatar(),
    name: faker.person.fullName(),
  };

  const [category_autres] = await Promise.all([
    prisma.category.findFirstOrThrow({
      where: { slug: "autres" },
    }),
  ]);

  return prisma.studient.create({
    data: {
      citizenship: faker.location.country(),
      city: faker.location.city(),
      field_of_study: faker.word.noun(),
      interest: { connect: { id: category_autres.id } },
      university: faker.company.name(),
      exchange: {
        create: {
          active: true,
          description: faker.lorem.paragraph(),
          is_online: true,
          places: 1,
          title: faker.lorem.sentence(),
          type: "RESEARCH",
          location: faker.location.city(),
          category_id: category_autres.id,
          in_exchange_of_id: category_autres.id,
          when: faker.date.future(),
        },
      },
      profile: {
        create: {
          bio: faker.lorem.paragraphs(faker.number.int({ max: 5 })),
          image,
          name,
          role: ProfileRole.STUDIENT,
          user: {
            create: {
              email: faker.internet.email().toLowerCase(),
              image,
              name,
            },
          },
        },
      },
    },
  });
}

async function studients() {
  const [foo, bar] = await Promise.all([
    studient(),
    studient(),
    ...Array.from({ length: 10 }).map(studient),
  ]);

  const foo_exchange_1 = await prisma.exchange.findFirstOrThrow({
    where: { owner_id: foo.id },
  });

  await prisma.exchange.update({
    data: { participants: { connect: { id: bar.id } } },
    where: { id: foo_exchange_1.id },
  });
  // const exchange_foo_bar = prisma.exchange.findFirst({where: {owner_id: foo.id})
}

//
//
//

async function partner() {
  const { image, name } = {
    image: faker.image.avatar(),
    name: faker.person.fullName(),
  };
  const [category_autres] = await Promise.all([
    prisma.category.findFirstOrThrow({
      where: { slug: "autres" },
    }),
  ]);

  return prisma.partner.create({
    data: {
      profile: {
        create: {
          bio: faker.lorem.paragraphs(faker.number.int({ max: 5 })),
          image,
          name,
          role: ProfileRole.PARTNER,
          user: {
            create: {
              email: faker.internet.email().toLowerCase(),
              image,
              name,
            },
          },
        },
      },
      link: faker.internet.url(),
      city: faker.location.city(),
      opportunities: {
        createMany: {
          data: Array.from({ length: 10 }).map(() => ({
            category_id: category_autres.id,
            cover: faker.image.url(),
            description: faker.lorem.paragraphs({ max: 9, min: 2 }),
            link: faker.internet.url(),
            location: faker.location.city(),
            slug: slugify(faker.lorem.sentence()).slice(0, 16).toLowerCase(),
            title: faker.lorem.sentence(),
            when: faker.date.future(),
          })),
        },
      },
    },
  });
}
async function partners() {
  return await Promise.all([partner(), partner()]);
}

//
//
//

async function categories() {
  await prisma.category.createMany({
    data: [
      {
        name: "Autres",
        slug: "autres",
        contexts: [
          CategoryContext.EXCHANGE,
          CategoryContext.FORUM,
          CategoryContext.OPPORTUNITY,
        ],
      },
      {
        name: "Échange de langue",
        contexts: [CategoryContext.EXCHANGE],
      },
      {
        name: "Notes des cours",
        contexts: [CategoryContext.EXCHANGE],
      },
      {
        name: "Activités",
        contexts: [CategoryContext.EXCHANGE, CategoryContext.FORUM],
      },
      {
        name: "Cours de français",
        contexts: [CategoryContext.OPPORTUNITY],
      },
      {
        name: "Bourses",
        contexts: [CategoryContext.OPPORTUNITY, CategoryContext.FORUM],
      },
      {
        name: "Logements",
        contexts: [CategoryContext.OPPORTUNITY, CategoryContext.FORUM],
      },
      {
        name: "Job étudiant",
        contexts: [CategoryContext.OPPORTUNITY, CategoryContext.FORUM],
      },
      {
        name: "Concours",
        contexts: [CategoryContext.OPPORTUNITY, CategoryContext.FORUM],
      },
      {
        name: "Aide financière",
        contexts: [CategoryContext.OPPORTUNITY, CategoryContext.FORUM],
      },
      {
        name: "Administratifs",
        contexts: [CategoryContext.FORUM],
      },
    ].map((data) => ({ ...data, slug: slugify(data.name.toLowerCase()) })),
  });
}
