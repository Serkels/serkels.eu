/**
 * Adds seed data to your db
 *
 * @link https://www.prisma.io/docs/guides/database/seed-database
 */
import { faker } from "@faker-js/faker";
import { CategoryContext, ExchangeType, ProfileRole } from "@prisma/client";
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
  const forum_categories_id = (
    await prisma.category.findMany({
      where: { contexts: { has: "FORUM" } },
    })
  ).map(({ id }) => id);

  return prisma.studient.create({
    data: {
      citizenship: faker.location.country(),
      city: faker.location.city(),
      field_of_study: faker.word.noun(),
      interest: { connect: { id: category_autres.id } },
      university: faker.company.name(),
      //
      asked_questions: {
        createMany: {
          data: faker.helpers.multiple(
            () => ({
              category_id: faker.helpers.arrayElement(forum_categories_id),
              title: faker.lorem.sentence(),
              created_at: faker.date.past(),
            }),
            { count: { min: 0, max: 5 } },
          ),
        },
      },
      proposed_exchanges: {
        createMany: {
          data: faker.helpers.multiple(
            () => ({
              active: true,
              description: faker.lorem.paragraph(),
              is_online: faker.number.int(100) > 50,
              places: faker.number.int(100),
              title: faker.lorem.sentence(),
              type: faker.helpers.arrayElement([
                ExchangeType.PROPOSAL,
                ExchangeType.RESEARCH,
              ]),
              location: faker.location.city(),
              category_id: category_autres.id,
              return_id: faker.helpers.maybe(() => category_autres.id) ?? null,
              when: faker.date.future(),
              created_at: faker.date.past(),
            }),
            { count: { min: 0, max: 5 } },
          ),
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

  const opportunity_categories_id = (
    await prisma.category.findMany({
      where: { contexts: { has: "OPPORTUNITY" } },
    })
  ).map(({ id }) => id);

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
          data: faker.helpers.multiple(
            () => ({
              category_id: faker.helpers.arrayElement(
                opportunity_categories_id,
              ),
              cover: faker.image.url(),
              description: faker.lorem.paragraphs({ max: 9, min: 2 }),
              link: faker.internet.url(),
              location: faker.location.city(),
              slug: slugify(faker.lorem.sentence()).slice(0, 16).toLowerCase(),
              title: faker.lorem.sentence(),
              when: faker.date.future(),
            }),
            { count: { min: 0, max: 5 } },
          ),
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
