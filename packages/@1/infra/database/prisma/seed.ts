/**
 * Adds seed data to your db
 *
 * @link https://www.prisma.io/docs/guides/database/seed-database
 */
import { faker } from "@faker-js/faker";
import { CategoryContext, ExchangeType, ProfileRole } from "@prisma/client";
import dedent from "dedent";
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

  const exchange_categories_id = (
    await prisma.category.findMany({
      where: { contexts: { has: "EXCHANGE" } },
    })
  ).map(({ id }) => id);

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
      interest: {
        connect: faker.helpers.arrayElements(
          exchange_categories_id.map((id) => ({ id })),
        ),
      },
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
          bio: dedent`
          # ${faker.company.buzzPhrase()}

          > ${faker.company.catchPhrase()}

          ${faker.lorem.paragraphs(faker.number.int({ max: 5 }))},

          ## ${faker.lorem.words()}

          ${faker.lorem.paragraphs()}

          - ${faker.lorem.sentence()}
          - ${faker.lorem.sentence()}
          - ${faker.lorem.sentence()}

          ${faker.lorem.paragraphs()}

          ---

          👋
          `,
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

async function random_other_profiles(profile_id: string) {
  const profile_count = await prisma.profile.count();
  return prisma.profile.findMany({
    take: faker.number.int({ min: 5, max: 10 }),
    skip: faker.number.int({ min: 0, max: profile_count }),
    where: { NOT: { id: profile_id } },
  });
}
async function studients() {
  const [foo, bar] = await Promise.all([
    studient(),
    studient(),
    ...Array.from({ length: 10 }).map(studient),
  ]);

  const [foo_profile_1, bar_profile_1] = await prisma.$transaction([
    prisma.profile.findFirstOrThrow({
      where: { id: foo.profile_id },
    }),
    prisma.profile.findFirstOrThrow({
      where: { id: bar.profile_id },
    }),
  ]);

  //

  const foo_exchange_1 = await prisma.exchange.findFirstOrThrow({
    where: { owner_id: foo.id },
  });

  await prisma.exchange.update({
    data: { participants: { connect: [{ id: bar.id }] } },
    where: { id: foo_exchange_1.id },
  });

  await prisma.profile.update({
    data: { following: { connect: [{ id: bar_profile_1.id }] } },
    where: { id: foo_profile_1.id },
  });

  random_other_profiles;
  // const profile_count = await prisma.profile.count();
  // await prisma.profile.updateMany({
  //   data: { following: { connect: [{ id: bar_profile_1.id }] } },
  //   where: { id: foo_profile_1.id },
  // });

  // const foo_con_1 = await prisma.exchange.findFirstOrThrow({
  //   where: { owner_id: foo.id },
  // });
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
            { count: { min: 1, max: 5 } },
          ),
        },
      },
    },
  });
}
async function partners() {
  return await Promise.all(
    faker.helpers.multiple(partner, { count: { max: 10, min: 5 } }),
  );
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
        contexts: [CategoryContext.OPPORTUNITY, CategoryContext.FORUM],
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
        name: "Aides financières",
        contexts: [CategoryContext.OPPORTUNITY, CategoryContext.FORUM],
      },
      {
        name: "Administratifs",
        contexts: [CategoryContext.FORUM],
      },
      {
        name: "Soutien académique",
        contexts: [CategoryContext.OPPORTUNITY],
      },
      {
        name: "Activités socio-culturelles",
        contexts: [CategoryContext.OPPORTUNITY],
      },
      {
        name: "Vie associative​",
        contexts: [CategoryContext.OPPORTUNITY],
      },
    ].map((data) => ({ ...data, slug: slugify(data.name.toLowerCase()) })),
  });
}
