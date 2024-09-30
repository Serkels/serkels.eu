//

import { NotificationType } from "@1.infra/database";
import { ID_Schema } from "@1.modules/core/domain";
import { startSpan } from "@1.modules/core/telemetry";
import { Student_Schema } from "@1.modules/profile.domain";
import { next_auth_procedure, router } from "@1.modules/trpc";
import { match } from "ts-pattern";
import { z } from "zod";

//

export const student_api_router = router({
  by_id: next_auth_procedure
    .input(z.string())
    .query(({ input: id, ctx: { prisma } }) => {
      return startSpan(
        {
          name: `prisma.student.findFirstOrThrow(id=${id})`,
          op: "prisma",
        },
        function findFirstOrThrow() {
          return prisma.student.findUniqueOrThrow({
            where: { id },
          });
        },
      );
    }),

  by_profile_id: next_auth_procedure
    .input(z.string())
    .query(({ input: profile_id, ctx: { prisma } }) => {
      return startSpan(
        {
          name: `prisma.student.findFirstOrThrow(profile_id=${profile_id})`,
          op: "prisma",
        },
        function findFirstOrThrow() {
          return Student_Schema.parse(
            prisma.student.findFirstOrThrow({
              where: { profile_id },
              include: { interest: true, profile: true },
            }),
            {
              path: [
                `prisma.student.findFirstOrThrow(profile_id=${profile_id})`,
              ],
            },
          );
        },
      );
    }),

  //

  me: router({
    update: next_auth_procedure
      .input(
        Student_Schema.omit({ id: true, profile: true, interest: true }).merge(
          z.object({ interest: z.array(ID_Schema).optional() }),
        ),
      )
      .mutation(({ input, ctx: { prisma, payload } }) => {
        const { id: profile_id } = payload.profile;
        return prisma.student.update({
          data: {
            ...input,
            interest: input.interest
              ? { set: input.interest.map((id) => ({ id })) }
              : {},
            updated_at: new Date(),
          },
          where: { profile_id },
        });
      }),

    //

    last_seen_by_thread_id: next_auth_procedure
      .input(
        z.object({
          thread_id: z.string(),
          type: z.enum([
            NotificationType.EXCHANGE_NEW_MESSAGE,
            NotificationType.INBOX_NEW_MESSAGE,
          ]),
        }),
      )
      .mutation(
        async ({ ctx: { payload, prisma }, input: { thread_id, type } }) => {
          const {
            profile: { id: profile_id },
          } = payload;
          const last_seen_date = new Date();
          const { id: student_id } = await prisma.student.findFirstOrThrow({
            select: { id: true },
            where: { profile_id },
          });

          return match(type)
            .with(NotificationType.EXCHANGE_NEW_MESSAGE, () =>
              prisma.$transaction([
                prisma.notification.updateMany({
                  data: { read_at: last_seen_date },
                  where: {
                    read_at: null,
                    owner: { id: profile_id },
                    exchange_message: { message: { thread_id } },
                    type: {
                      in: [
                        NotificationType.EXCHANGE_NEW_MESSAGE,
                        NotificationType.EXCHANGE_NEW_PARTICIPANT,
                      ],
                    },
                  },
                }),
                prisma.exchangeThread.update({
                  data: { last_seen_date },
                  where: {
                    owner_id_thread_id: { owner_id: student_id, thread_id },
                  },
                }),
              ]),
            )
            .with(NotificationType.INBOX_NEW_MESSAGE, () =>
              prisma.$transaction([
                prisma.notification.updateMany({
                  data: { read_at: last_seen_date },
                  where: {
                    read_at: null,
                    owner: { id: profile_id },
                    inbox_message: { message: { thread_id } },
                    type: NotificationType.INBOX_NEW_MESSAGE,
                  },
                }),
                prisma.inboxThread.update({
                  data: { last_seen_date },
                  where: {
                    owner_id_thread_id: { owner_id: student_id, thread_id },
                  },
                }),
              ]),
            )
            .exhaustive();
        },
      ),
  }),
});
