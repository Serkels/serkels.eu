/**
 * Adds seed data to your db
 *
 * @link https://www.prisma.io/docs/guides/database/seed-database
 */
import { faker } from "@faker-js/faker";
import {
  CategoryContext,
  ExchangeThreadStatus,
  ExchangeType,
  ProfileRole,
} from "@prisma/client";
import dedent from "dedent";
import process from "node:process";
import slugify from "slugify";
import prisma from "../index";

async function main() {
  await prisma.$transaction([
    prisma.user.deleteMany(),
    prisma.account.deleteMany(),
    prisma.bookmark.deleteMany(),
    prisma.category.deleteMany(),
    prisma.deal.deleteMany(),
    prisma.exchange.deleteMany(),
    prisma.exchangeThread.deleteMany(),
    prisma.inboxThread.deleteMany(),
    prisma.message.deleteMany(),
    prisma.opportunity.deleteMany(),
    prisma.partner.deleteMany(),
    prisma.profile.deleteMany(),
    prisma.question.deleteMany(),
    prisma.signupPayload.deleteMany(),
    prisma.studient.deleteMany(),
    prisma.thread.deleteMany(),
  ]);

  //

  await categories();

  await studients();
  await partners();

  await studients_bookmarks();
  await studients_participants_in_exchanges();

  await studients_messages();
  await studients_messages(); // more messages

  await profile_contacts();
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
      where: { context: CategoryContext.EXCHANGE },
    })
  ).map(({ id }) => id);

  const forum_categories_id = (
    await prisma.category.findMany({
      where: { context: CategoryContext.FORUM },
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
              category_id: faker.helpers.arrayElement([
                category_autres.id,
                ...forum_categories_id,
              ]),
              title: faker.company.catchPhrase(),
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
              category_id: faker.helpers.arrayElement([
                category_autres.id,
                ...exchange_categories_id,
              ]),
              created_at: faker.date.past(),
              updated_at: faker.date.recent(),
              description: faker.lorem.paragraph(),
              is_online: faker.number.int(100) > 50,
              location: faker.location.city(),
              places: faker.number.int({ min: 1, max: 9 }),
              return_id:
                faker.helpers.maybe(() =>
                  faker.helpers.arrayElement([
                    category_autres.id,
                    ...exchange_categories_id,
                  ]),
                ) ?? null,
              title: faker.company.catchPhrase(),
              type: faker.helpers.arrayElement([
                ExchangeType.PROPOSAL,
                ExchangeType.RESEARCH,
              ]),
              when: faker.date.future(),
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

async function studients() {
  await Promise.all(Array.from({ length: 22 }).map(studient));
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
      where: {
        OR: [{ context: CategoryContext.OPPORTUNITY }, { context: null }],
      },
    })
  ).map(({ id }) => id);

  return prisma.partner.create({
    data: {
      profile: {
        create: {
          bio: dedent`
          # ${faker.company.buzzPhrase()}

          > ${faker.company.catchPhrase()}

          ${faker.lorem.paragraphs(faker.number.int({ max: 5 }))},
          `,
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
    faker.helpers.multiple(partner, { count: { max: 15, min: 10 } }),
  );
}

//
//
//

interface Category {
  name: string;
  context: CategoryContext | null;
  rank?: number;
  slug?: string;
}

async function create_categories(categories: Category[]) {
  for (let rank = 0; rank < categories.length; rank++) {
    const category = categories[rank];
    if (!category) continue;
    const { name, context } = category;
    const slug = category.slug ?? slugify(name).toLocaleLowerCase();

    await prisma.category.create({
      data: {
        name,
        slug,
        context,
        rank: category.rank === undefined ? rank + 1 : category.rank,
      },
    });
  }
}

async function categories() {
  await create_categories(
    [
      {
        name: "Autres",
        rank: 0,
      },
    ].map((draft) => ({ ...draft, context: null })),
  );

  //

  await create_categories(
    [
      { name: "Activités socio-culturelles​" },
      { name: "Cours de langues" },
      { name: "Notes des cours" },
      { name: "Soutien académique​" },
    ]
      .reverse()
      .map((draft) => ({ ...draft, context: CategoryContext.EXCHANGE })),
  );
  //

  await create_categories(
    [
      { name: "Cours et Matières" },
      { name: "Logement" },
      { name: "Stages et Alternance" },
      { name: "Santé et Bien-être" },
      { name: "Vie estudiantine" },
      { name: "Transport et Mobilité" },
      { name: "Technologie et Informatique" },
      { name: "International et Échanges" },
      { name: "Finances et Bourses" },
    ]
      .reverse()
      .map((draft) => ({ ...draft, context: CategoryContext.FORUM })),
  );

  //

  await create_categories(
    [
      { name: "Activités" },
      { name: "Aides financières" },
      { name: "Bourses" },
      { name: "Concours" },
      { name: "Cours de langues" },
      { name: "Job étudiant" },
      { name: "Logements" },
    ]
      .reverse()
      .map((draft) => ({ ...draft, context: CategoryContext.OPPORTUNITY })),
  );
}

async function studients_bookmarks() {
  const studients = await prisma.studient.findMany({
    include: { profile: true },
  });
  const opportunities = await prisma.opportunity.findMany();
  const exchanges = await prisma.exchange.findMany();

  await prisma.bookmark.createMany({
    data: [
      ...Array.from({ length: 20 }).map(() => ({
        owner_id: faker.helpers.arrayElement(studients).profile_id,
        opportunity_id: faker.helpers.arrayElement(opportunities).id,
      })),
      ...Array.from({ length: 20 }).map(() => ({
        owner_id: faker.helpers.arrayElement(studients).profile_id,
        exchange_id: faker.helpers.arrayElement(exchanges).id,
      })),
    ],
    skipDuplicates: true,
  });
}

async function studients_participants_in_exchanges() {
  const studients = await prisma.studient.findMany();
  const exchanges = await prisma.exchange.findMany({
    include: { owner: true },
  });

  for (const exchange of exchanges) {
    const other_studients = studients.filter(
      ({ id }) => id !== exchange.owner_id,
    );
    const exchange_id = exchange.id;

    await Promise.all(
      faker.helpers
        .arrayElements(other_studients, { min: 0, max: exchange.places })
        .map(async (participant) => {
          const participant_id = participant.id;

          const { id: deal_id } = await prisma.deal.upsert({
            create: {
              parent_id: exchange_id,
              participant_id,
              status: faker.helpers.arrayElement(
                Object.values(ExchangeThreadStatus),
              ),
              created_at: faker.date.past(),
              updated_at: faker.date.recent(),
            },
            update: {},
            where: {
              participant_per_exchange: {
                parent_id: exchange_id,
                participant_id,
              },
            },
          });

          const { thread_id } = await prisma.exchangeThread.create({
            data: {
              deal: { connect: { id: deal_id } },
              owner: { connect: { id: exchange.owner_id } },
              thread: {
                create: {
                  created_at: faker.date.past(),
                  updated_at: faker.date.past(),
                  participants: {
                    connect: [
                      { id: exchange.owner.profile_id },
                      { id: participant.profile_id },
                    ],
                  },
                  messages: {
                    createMany: {
                      data: faker.helpers.multiple(
                        () => ({
                          author_id: faker.helpers.arrayElement([
                            { id: exchange.owner.profile_id },
                            { id: participant.profile_id },
                          ]).id,
                          content: faker.lorem.sentences(),
                          created_at: faker.helpers.weightedArrayElement([
                            { value: faker.date.past(), weight: 1 },
                            { value: faker.date.recent(), weight: 5 },
                          ]),
                        }),
                        { count: { min: 1, max: 5 } },
                      ),
                    },
                  },
                },
              },
            },
          });

          await prisma.exchangeThread.create({
            data: { deal_id, thread_id, owner_id: participant_id },
          });
        }),
    );
  }
}

async function profile_contacts() {
  const profile_ids = await prisma.profile.findMany({ select: { id: true } });

  for (const profile of profile_ids) {
    const other_profiles = profile_ids.filter(({ id }) => id !== profile.id);
    await prisma.profile.update({
      data: {
        contacts: {
          connect: faker.helpers.arrayElements(other_profiles),
        },
        following: {
          connect: faker.helpers.arrayElements(other_profiles),
        },
      },
      where: { id: profile.id },
    });
  }
}

async function studients_messages() {
  const studients = await prisma.studient.findMany();

  for (const studient of studients) {
    const recipient_studient = faker.helpers.arrayElement(
      studients.filter(({ id }) => id !== studient.id),
    );
    const { thread_id } = await prisma.inboxThread.create({
      data: {
        owner: { connect: { id: studient.id } },
        thread: {
          create: {
            created_at: faker.date.past(),
            updated_at: faker.date.past(),
            participants: {
              connect: [
                { id: studient.profile_id },
                { id: recipient_studient.profile_id },
              ],
            },
            messages: {
              createMany: {
                data: faker.helpers.multiple(
                  () => ({
                    author_id: faker.helpers.arrayElement([
                      { id: studient.profile_id },
                      { id: recipient_studient.profile_id },
                    ]).id,
                    content: faker.lorem.sentences(),
                    created_at: faker.helpers.weightedArrayElement([
                      { value: faker.date.past(), weight: 1 },
                      { value: faker.date.recent(), weight: 5 },
                    ]),
                  }),
                  { count: { min: 5, max: 30 } },
                ),
              },
            },
          },
        },
      },
    });
    if (
      await prisma.inboxThread.findFirst({
        where: { owner_id: recipient_studient.id, thread_id },
      })
    ) {
      continue;
    }
    await prisma.inboxThread.create({
      data: {
        owner: { connect: { id: recipient_studient.id } },
        thread: { connect: { id: thread_id } },
      },
    });
  }
}
