/**
 * Adds seed data to your db
 *
 * @link https://www.prisma.io/docs/guides/database/seed-database
 */
import prisma from "#prisma";
import {
  CategoryContext,
  ExchangeThreadStatus,
  ExchangeType,
  NotificationType,
  Prisma,
  ProfileRole,
  type Deal,
  type Exchange,
} from "#prisma/client";
import { faker } from "@faker-js/faker";
import { isAfter } from "date-fns";
import dedent from "dedent";
import process from "node:process";
import slugify from "slugify";
import { partners as partner_fixtures } from "./seed/fixtures/partners";
import { students as student_fixtures } from "./seed/fixtures/students";
import { faker_image_avatar } from "./seed/helpers/faker_image_avatar";

//
//#region 🌱 Seed
//

Promise.resolve()
  .then(delete_all)
  .then(mandatory_seed)
  .then(faker_seed)
  .then(vip_seed)
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

//

async function delete_all() {
  await prisma.$transaction([
    prisma.user.deleteMany(),
    //
    prisma.account.deleteMany(),
    prisma.bookmark.deleteMany(),
    prisma.category.deleteMany(),
    prisma.deal.deleteMany(),
    prisma.exchange.deleteMany(),
    prisma.exchangeThread.deleteMany(),
    prisma.inboxMessageNotification.deleteMany(),
    prisma.inboxThread.deleteMany(),
    prisma.message.deleteMany(),
    prisma.notification.deleteMany(),
    prisma.opportunity.deleteMany(),
    prisma.partner.deleteMany(),
    prisma.profile.deleteMany(),
    prisma.profileAddedNotification.deleteMany(),
    prisma.question.deleteMany(),
    prisma.signupPayload.deleteMany(),
    prisma.student.deleteMany(),
    prisma.thread.deleteMany(),
    //
  ]);
  console.log("🗑️");
}
//

async function mandatory_seed() {
  await categories();
  console.log("🌱 . Categories.");

  console.log("🌱 .. Mandatory Seed.");
}

async function faker_seed() {
  console.log("🌱 . Yopmail Students.");
  await student_yopmail();
  await students();
  console.log("🌱 . Students.");
  await partners();
  console.log("🌱 . Partners.");

  await partners_yopmail();
  console.log("🌱 . Partners Yopmail.");

  await students_bookmarks();
  console.log("🌱 . Students bookmarks.");
  await students_participants_in_exchanges();
  console.log("🌱 . Students participe to exchanges.");

  await students_messages();
  console.log("🌱 . Students sent some messages.");

  await students_awnsers();
  console.log("🌱 . Students awnser to questions.");

  await student_fixtures();
  await partner_fixtures();
  console.log("🌱 . E2E Fixture.");

  console.log("🌱 .. Faker Seed.");
}

async function vip_seed() {
  await partners_vip();
  console.log("🌱 . Partners VIP.");

  console.log("🌱 .. VIP Seed.");
}

//
//#endregion
//

//
//#region 🎓 Students
//

async function student_yopmail() {
  const { id } = await student({
    email: "douglas@yopmail.com",
    name: "Douglas",
  });
  await prisma.student.update({
    data: {
      proposed_exchanges: {
        createMany: {
          data: {
            category_id: await prisma.category
              .findFirstOrThrow({
                where: {
                  name: "Cours de langues",
                  context: CategoryContext.EXCHANGE,
                },
              })
              .then(({ id }) => id),
            description: faker.lorem.paragraphs(),
            is_active: true,
            is_online: false,
            location: "Paris",
            places: 1,
            return_id: null,
            title: "Concert de jazz",
            type: ExchangeType.PROPOSAL,
          },
        },
      },
    },
    where: { id },
  });

  await student({ email: "johan@yopmail.com", name: "Johan" });
  await student({ email: "dino@yopmail.com", name: "Dino" });
}

async function student({
  email: studient_email,
  name: studient_name,
}: {
  email: string;
  name: string;
}) {
  const { image, name } = {
    image: faker_image_avatar(),
    name: studient_name,
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

  const updated_at = faker.date.past();
  const asked_questions: Prisma.QuestionCreateNestedManyWithoutOwnerInput = {
    createMany: {
      data: faker.helpers.multiple<Prisma.QuestionUncheckedCreateWithoutOwnerInput>(
        () => ({
          category_id: faker.helpers.arrayElement([
            category_autres.id,
            ...forum_categories_id,
          ]),
          title: faker.company.catchPhrase(),
          created_at: faker.helpers.arrayElement([
            updated_at,
            faker.date.recent({ refDate: updated_at }),
          ]),
          updated_at,
        }),
        { count: { min: 0, max: 5 } },
      ),
    },
  };

  return prisma.student.create({
    data: {
      language: faker.company.name(),
      city: faker.location.city(),
      field_of_study: faker.word.noun(),
      interest: {
        connect: faker.helpers.arrayElements(
          exchange_categories_id.map((id) => ({ id })),
        ),
      },
      university: faker.company.name(),
      //
      asked_questions,
      proposed_exchanges: {
        createMany: {
          data: faker.helpers.multiple(
            () => ({
              is_active: true,
              category_id: faker.helpers.arrayElement([
                category_autres.id,
                ...exchange_categories_id,
              ]),
              created_at: faker.date.past(),
              updated_at: faker.date.recent({ days: 66 }),
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
              expiry_date: faker.helpers.weightedArrayElement([
                { value: null, weight: 1 },
                { value: faker.date.future({ years: 0.1 }), weight: 1 },
                { value: faker.date.recent({ days: 1 }), weight: 2 },
              ]),
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
          role: ProfileRole.STUDENT,
          user: {
            create: {
              email: studient_email,
              image,
              name,
            },
          },
        },
      },
    },
  });
}

async function students() {
  await Promise.all(
    Array.from({ length: 22 }).map(() =>
      student({
        email: faker.internet.email().toLowerCase(),
        name: faker.person.fullName(),
      }),
    ),
  );
}

//
//#endregion
//

//
//#region 🤝 Partners
//

async function partner({ email, name }: { email: string; name: string }) {
  const image = faker_image_avatar();

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
              email,
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
              expiry_date: faker.date.future(),
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
    faker.helpers.multiple(
      () =>
        partner({
          email: faker.internet.email().toLowerCase(),
          name: faker.person.fullName(),
        }),
      { count: { max: 15, min: 10 } },
    ),
  );
}

async function partners_yopmail() {
  return prisma.partner.create({
    data: {
      profile: {
        create: {
          bio: dedent`
          # One Does University

          > One does not simply implement, it teaches.
          `,
          image: "https://avatars.githubusercontent.com/u/9634140?s=200&v=4",
          name: "One Does University",
          role: ProfileRole.PARTNER,
          user: {
            create: {
              email: "onedoesuniversity@yopmail.com",
              image:
                "https://avatars.githubusercontent.com/u/9634140?s=200&v=4",
              name: "One Does University",
            },
          },
        },
      },
      link: "https://onedoes.github.io",
      city: "Paris",
      opportunities: {
        createMany: {
          data: {
            category_id: await prisma.category
              .findFirstOrThrow({
                select: { id: true },
                where: {
                  name: "Cours de langues",
                  context: CategoryContext.OPPORTUNITY,
                },
              })
              .then(({ id }) => id),
            cover: faker.image.url(),
            description: dedent`
            ## Cours de JavaScript

            > JavaScript est un langage de programmation créé en 1995 par Brendan Eich.
            > Il est le premier langage de programmation à être implémenté par le navigateur web.

            Parce que JavaScript est sur utilisé dans le monde du web, il est toujours utilie pour créer des applications web.
            `,
            link: faker.internet.url(),
            location: "Paris",
            slug:
              slugify("Cours de JavaScript").slice(0, 16).toLowerCase() +
              "-" +
              faker.string.uuid(),
            title: "Cours de JavaScript",
            expiry_date: faker.date.future(),
          },
        },
      },
    },
  });
}

async function partners_vip() {
  await prisma.partner.create({
    data: {
      profile: {
        create: {
          bio: "# The Illustionist",
          name: "Ahmad Ali University",
          image: "https://picsum.photos/300/300",
          role: ProfileRole.PARTNER,
          user: {
            create: {
              email: "ahmadali.fr@gmail.com",
              name: "Ahmad Ali University",
            },
          },
        },
      },
      link: "https://ahmadali.fr",
      city: "Paris",
    },
  });
}

//
//#endregion
//

//
//#region 📦 Categories
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
      { name: "Activités​" },
      { name: "Cours de langues" },
      { name: "Notes de cours" },
      { name: "Soutien académique​" },
      { name: "Objets" },
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
      { name: "Vie étudiante" },
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
      { name: "Cours de langues" },
      { name: "Soutien académique" },
      { name: "Logement" },
      { name: "Job étudiant" },
      { name: "Concours" },
      { name: "Aides financières" },
      { name: "Activités socio-culturelles​" },
      { name: "Vie associative" },
    ]
      .reverse()
      .map((draft) => ({ ...draft, context: CategoryContext.OPPORTUNITY })),
  );
}

//
//#endregion
//

//
//#region 🔖 Bookmarks
//

async function students_bookmarks() {
  const students = await prisma.student.findMany({
    include: { profile: true },
  });
  const opportunities = await prisma.opportunity.findMany();
  const exchanges = await prisma.exchange.findMany();

  await prisma.bookmark.createMany({
    data: [
      ...Array.from({ length: 20 }).map(() => ({
        owner_id: faker.helpers.arrayElement(students).profile_id,
        opportunity_id: faker.helpers.arrayElement(opportunities).id,
      })),
      ...Array.from({ length: 20 }).map(() => ({
        owner_id: faker.helpers.arrayElement(students).profile_id,
        exchange_id: faker.helpers.arrayElement(exchanges).id,
      })),
    ],
    skipDuplicates: true,
  });
}

//
//#endregion
//

//
//#region 🔄 Exchanges
//

async function students_participants_in_exchanges() {
  const students = await prisma.student.findMany({
    select: { id: true, profile_id: true },
  });
  const exchanges = await prisma.exchange.findMany({
    select: {
      id: true,
      owner: { select: { id: true, profile_id: true } },
      places: true,
    },
  });

  for (const exchange of exchanges) {
    const other_students = students.filter(
      ({ id }) => id !== exchange.owner.id,
    );
    const exchange_id = exchange.id;

    await Promise.all(
      faker.helpers
        .arrayElements(other_students, { min: 0, max: exchange.places })
        .map(async (participant) => {
          const participant_id = participant.id;

          const { id: deal_id, status } = await prisma.deal.upsert({
            create: {
              parent_id: exchange_id,
              participant_id,
              status: faker.helpers.arrayElement(
                Object.values(ExchangeThreadStatus),
              ),
              created_at: faker.date.past(),
              updated_at: faker.date.recent({ days: 66 }),
            },
            select: { id: true, status: true },
            update: {
              updated_at: faker.date.recent({ days: 33 }),
            },
            where: {
              participant_per_exchange: {
                parent_id: exchange_id,
                participant_id,
              },
            },
          });
          const is_archived = status === ExchangeThreadStatus.DENIED;

          const { thread_id } = await prisma.exchangeThread.create({
            data: {
              deal: { connect: { id: deal_id } },
              is_archived,
              owner: { connect: { id: exchange.owner.id } },
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
                            {
                              value: faker.date.recent({ days: 66 }),
                              weight: 5,
                            },
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
            data: { deal_id, thread_id, owner_id: participant_id, is_archived },
          });

          const updated_exchange = await prisma.exchange.findFirstOrThrow({
            select: {
              deals: { where: { status: ExchangeThreadStatus.APPROVED } },
              expiry_date: true,
              places: true,
            },
            where: { id: exchange_id },
          });

          const is_active = is_active_exchange(updated_exchange);

          await prisma.exchange.update({
            data: { is_active },
            where: { id: exchange_id },
          });
        }),
    );
  }
}

export function is_active_exchange(
  exchange: Pick<Exchange, "expiry_date" | "places"> & { deals: Deal[] },
) {
  return exchange.deals.length < exchange.places;
}

//
//#endregion
//

//
//#region 📝 Questions/Awnsers
//

async function students_awnsers() {
  const students = await prisma.student.findMany();
  const questions = await prisma.question.findMany({
    include: { owner: { select: { id: true } } },
  });

  for (const question of questions) {
    const { owner } = question;
    const other_students = faker.helpers.arrayElements(
      students.filter(({ id }) => id !== owner.id),
    );

    const { answers } = await prisma.question.update({
      data: {
        answers: {
          createMany: {
            data: faker.helpers
              .arrayElements(other_students, {
                min: 0,
                max: other_students.length,
              })
              .map<Prisma.AnswerCreateManyParentInput>(({ id: owner_id }) => ({
                content: faker.company.catchPhrase(),
                owner_id,
              })),
          },
        },
      },
      include: { answers: true },
      where: { id: question.id },
    });

    if (faker.helpers.rangeToNumber({ min: 0, max: 100 }) > 0) {
      const accepted_answer = faker.helpers.arrayElement([
        { id: null },
        ...answers,
      ]);
      await prisma.question.update({
        data: { accepted_answer_id: accepted_answer.id },
        where: { id: question.id },
      });
    }
    // await faker.helpers.maybe(
    //   () =>
    //     prisma.question.update({
    //       data: { accepted_answer_id: faker.helpers.arrayElement(q_answer).id },
    //       where: { id: question.id },
    //     }),
    //   { probability: 0.2 },
    // );
  }
}

//
//#endregion
//

//
//#region 📬 Messages
//

async function students_messages() {
  const students = await prisma.student.findMany();

  for (const student of students) {
    const other_students = faker.helpers.arrayElements(
      students.filter(({ id }) => id !== student.id),
    );

    const contacts = faker.helpers.arrayElements(other_students, {
      min: 0,
      max: 10,
    });

    const notifications = await prisma.notification.createManyAndReturn({
      data: contacts.map(({ profile_id }) => ({
        owner_id: profile_id,
        type: NotificationType.PROFILE_ADDED,
        read_at: null,
        created_at: faker.date.past(),
      })),
      select: { id: true },
    });
    await prisma.profile.update({
      data: {
        contacts: {
          connect: contacts.map(({ profile_id }) => ({
            id: profile_id,
          })),
        },
        added_notifications: {
          createMany: {
            data: notifications.map(({ id: notification_id }) => ({
              notification_id,
            })),
          },
        },
      },
      where: { id: student.profile_id },
    });

    await Promise.all(
      contacts.map(async (recipient_student) => {
        const last_seen_date = faker.date.recent();
        const thread_created_at = faker.date.past({
          refDate: last_seen_date,
        });
        const thread_updated_at = faker.date.between({
          from: thread_created_at,
          to: last_seen_date,
        });

        if (
          await prisma.inboxThread.findFirst({
            where: {
              owner_id: recipient_student.id,
              thread: {
                participants: {
                  some: { id: student.profile_id },
                },
              },
            },
          })
        )
          return;

        const thread = await prisma.thread.create({
          data: {
            created_at: thread_created_at,
            updated_at: thread_updated_at,
            participants: {
              connect: [
                { id: student.profile_id },
                { id: recipient_student.profile_id },
              ],
            },
            inbox_threads: {
              createMany: {
                data: [
                  {
                    owner_id: student.id,
                    last_seen_date: last_seen_date,
                  },
                  {
                    owner_id: recipient_student.id,
                    last_seen_date: faker.date.between({
                      from: thread_created_at,
                      to: last_seen_date,
                    }),
                  },
                ],
              },
            },
            messages: {
              createMany: {
                data: faker.helpers.multiple(
                  () => {
                    const message_created_at = faker.date.between({
                      from: thread_created_at,
                      to: thread_updated_at,
                    });
                    return {
                      author_id: faker.helpers.arrayElement([
                        { id: student.profile_id },
                        { id: recipient_student.profile_id },
                      ]).id,
                      content: faker.lorem.sentences(),
                      created_at: message_created_at,
                      updated_at: message_created_at,
                    };
                  },
                  { count: { min: 1, max: 11 } },
                ),
              },
            },
          },
          select: {
            id: true,
            updated_at: true,
            inbox_threads: {
              select: { last_seen_date: true },
              where: { owner_id: recipient_student.id },
            },
            messages: {
              select: {
                id: true,
                created_at: true,
              },
              orderBy: { created_at: "desc" },
              take: 1,
              where: { author: { id: student.profile_id } },
            },
          },
        });

        const recipient_inbox = thread.inbox_threads.at(0);
        const message = thread.messages.at(0);
        if (!recipient_inbox) {
          return;
        }
        if (!message) {
          return;
        }
        {
          const { last_seen_date } = recipient_inbox;
          const { created_at } = message;
          await prisma.inboxMessageNotification.create({
            data: {
              message: { connect: { id: message.id } },
              notification: {
                create: {
                  type: "INBOX_NEW_MESSAGE",
                  created_at,
                  read_at: isAfter(last_seen_date, created_at)
                    ? last_seen_date
                    : null,
                  owner_id: recipient_student.profile_id,
                },
              },
            },
          });
        }
      }),
    );
  }
}
