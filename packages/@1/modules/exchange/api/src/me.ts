//

import { StateError } from "@1.modules/core/errors";
import {
  Deal_Status_Schema,
  Exchange_Create_Schema,
  HANDSHAKE_ACCEPETED,
  HANDSHAKE_COMPLETED,
  HANDSHAKE_DENIED,
  HANDSHAKE_TOCTOC,
} from "@1.modules/exchange.domain";
import { deal_flow } from "@1.modules/exchange.domain/deal.machine";
import { next_auth_procedure, router } from "@1.modules/trpc";
import { next_auth_input_token } from "@1.modules/trpc/src/trpc";
import { observable } from "@trpc/server/observable";
import { EventEmitter } from "events";
import { match } from "ts-pattern";
import { createActor } from "xstate";
import { z } from "zod";

//

class DealEventEmitter extends EventEmitter {}
const deal_event_emitter = new DealEventEmitter();

export const me = router({
  //

  deal_by_exchange_id: next_auth_procedure
    .input(z.string())
    .query(async ({ ctx: { payload, prisma }, input: parent_id }) => {
      const { profile } = payload;
      const { id: studient_id } = await prisma.studient.findUniqueOrThrow({
        select: { id: true },
        where: { profile_id: profile.id },
      });

      return prisma.deal.findUnique({
        include: {
          exchange_threads: {
            where: { owner_id: studient_id },
            include: { thread: true },
          },
        },
        where: {
          participant_per_exchange: { parent_id, participant_id: studient_id },
        },
      });
    }),

  //

  delete: next_auth_procedure
    .input(z.string())
    .mutation(({ input: exchange_id, ctx: { prisma, payload } }) => {
      const { id: profile_id } = payload.profile;
      return prisma.exchange.delete({
        where: { id: exchange_id, owner: { profile_id } },
      });
    }),

  //

  find_active: next_auth_procedure
    .input(
      z.object({
        cursor: z.string().optional(),
        limit: z.number().min(1).max(10).default(10),
      }),
    )
    .query(async ({ input, ctx: { payload, prisma } }) => {
      const { profile } = payload;
      const { cursor, limit } = input;

      const data = await prisma.exchange.findMany({
        ...(cursor ? { cursor: { id: cursor } } : {}),
        take: limit,
        where: {
          is_active: true,
          OR: [
            { owner: { profile_id: profile.id } },
            {
              deals: {
                some: { participant: { profile: { id: profile.id } } },
              },
            },
          ],
        },
        orderBy: { updated_at: "desc" },
      });

      let next_cursor: typeof cursor | undefined = undefined;
      if (data.length > limit) {
        const next_item = data.pop()!;
        next_cursor = next_item.id;
      }

      return { data, next_cursor };
    }),

  //

  inbox: router({
    by_exchange_id: next_auth_procedure
      .input(
        z.object({
          exchange_id: z.string(),
          cursor: z.string().optional(),
          limit: z.number().min(1).max(10).default(10),
        }),
      )
      .query(async ({ ctx: { payload, prisma }, input }) => {
        const { profile } = payload;
        const { cursor, exchange_id, limit } = input;
        const { id: studient_id } = await prisma.studient.findUniqueOrThrow({
          select: { id: true },
          where: { profile_id: profile.id },
        });

        const data = await prisma.exchangeThread.findMany({
          ...(cursor ? { cursor: { id: cursor } } : {}),
          orderBy: {
            // deal: { status: "asc" },
            thread: { updated_at: "desc" },
          },
          take: limit + 1,
          where: { owner_id: studient_id, deal: { parent_id: exchange_id } },
        });

        let next_cursor: typeof cursor | undefined = undefined;
        if (data.length > limit) {
          const next_item = data.pop()!;
          next_cursor = next_item.id;
        }

        return { data, next_cursor };
      }),

    //

    by_thread_id: next_auth_procedure
      .input(z.string())
      .query(async ({ ctx: { payload, prisma }, input: thread_id }) => {
        const { profile } = payload;
        const { id: studient_id } = await prisma.studient.findUniqueOrThrow({
          select: { id: true },
          where: { profile_id: profile.id },
        });
        return prisma.exchangeThread.findUniqueOrThrow({
          include: {
            deal: true,
            thread: {
              include: {
                participants: {
                  select: { id: true, name: true, image: true },
                },
                messages: { take: 1, orderBy: { created_at: "desc" } },
              },
            },
          },
          where: { owner_id_thread_id: { owner_id: studient_id, thread_id } },
        });
      }),

    //

    create_deal: next_auth_procedure
      .input(z.object({ content: z.string(), exchange_id: z.string() }))
      .mutation(async ({ ctx: { payload, prisma }, input }) => {
        const { profile } = payload;
        const { content, exchange_id } = input;

        const {
          owner: {
            id: owner_id,
            profile: { id: owner_profile_id },
          },
        } = await prisma.exchange.findUniqueOrThrow({
          include: {
            owner: { include: { profile: { select: { id: true } } } },
          },
          where: { id: exchange_id },
        });

        const { id: studient_id } = await prisma.studient.findUniqueOrThrow({
          select: { id: true },
          where: { profile_id: profile.id },
        });

        const { id: thread_id } = await prisma.thread.create({
          data: {
            participants: {
              connect: [{ id: profile.id }, { id: owner_profile_id }],
            },
            messages: { create: { content, author_id: profile.id } },
          },
        });

        return prisma.deal.create({
          data: {
            parent: { connect: { id: exchange_id } },
            participant: { connect: { id: studient_id } },
            exchange_threads: {
              createMany: {
                data: [
                  {
                    owner_id,
                    thread_id,
                  },
                  {
                    owner_id: studient_id,
                    thread_id,
                  },
                ],
              },
            },
          },
          include: {
            exchange_threads: {
              take: 1,
              where: { owner_id: studient_id },
            },
          },
        });
      }),

    //

    on_new_deal: next_auth_input_token
      .input(z.object({ thread_id: z.string() }))
      .subscription(async ({ ctx: { prisma, payload }, input }) => {
        const { thread_id } = input;
        const {
          profile: { id: profile_id },
        } = payload;

        // guard : Only subscribe to participating threads
        await prisma.thread.findUniqueOrThrow({
          where: { id: thread_id, participants: { some: { id: profile_id } } },
        });

        return observable<void>((emit) => {
          const new_message = () => {
            emit.next();
          };
          deal_event_emitter.on(`${thread_id}>new_deal`, new_message);
          return () => {
            deal_event_emitter.off(`${thread_id}>new_deal`, new_message);
          };
        });
      }),

    //

    next_actions: next_auth_procedure
      .input(
        z.object({
          exchange_id: z.string(),
          thread_id: z.string(),
        }),
      )
      .query(async ({ ctx: { payload, prisma }, input }) => {
        const { exchange_id, thread_id } = input;
        const { profile } = payload;
        const { id: studient_id } = await prisma.studient.findUniqueOrThrow({
          select: { id: true },
          where: { profile_id: profile.id },
        });

        const deal = await prisma.deal.findFirstOrThrow({
          include: {
            parent: true,
            exchange_threads: {
              where: { owner_id: studient_id },
              include: { thread: true },
            },
          },
          where: {
            parent_id: exchange_id,
            exchange_threads: { some: { thread_id } },
          },
        });

        const machine = deal_flow.provide({
          guards: {
            is_organizer: () => deal.parent.owner_id === studient_id,
            is_participant: () => deal.participant_id === studient_id,
          },
        });

        const active_state = machine.resolveState({ value: deal.status });

        const actor = createActor(machine, { snapshot: active_state }).start();

        const deal_state = actor.getSnapshot();

        return {
          can_approuve: deal_state.can({ type: "APPROVE" }) ?? false,
          can_denie: deal_state.can({ type: "DENIE" }) ?? false,
        };
      }),

    action: next_auth_procedure
      .input(
        z.object({
          exchange_id: z.string(),
          thread_id: z.string(),
          action: z.enum(["APPROVE", "DENIE"]),
        }),
      )
      .mutation(async ({ ctx: { payload, prisma }, input }) => {
        const { action, exchange_id, thread_id } = input;
        const { profile } = payload;
        const { id: studient_id } = await prisma.studient.findUniqueOrThrow({
          select: { id: true },
          where: { profile_id: profile.id },
        });

        const deal = await prisma.deal.findFirstOrThrow({
          include: {
            parent: true,
            exchange_threads: {
              where: { owner_id: studient_id },
              include: { thread: true },
            },
          },
          where: {
            parent_id: exchange_id,
            exchange_threads: { some: { thread_id } },
          },
        });

        const machine = deal_flow.provide({
          guards: {
            is_organizer: () => deal.parent.owner_id === studient_id,
            is_participant: () => deal.participant_id === studient_id,
          },
        });
        const active_state = machine.resolveState({ value: deal.status });

        const actor = createActor(machine, { snapshot: active_state }).start();

        actor.send({ type: action });

        const state = actor.getSnapshot();

        if (state.value === deal.status) {
          throw new StateError("Illegal action");
        }

        const content = match(state.value)
          .with("APPROVED_BY_THE_ORGANIZER", () => HANDSHAKE_ACCEPETED)
          .with("APPROVED", () => HANDSHAKE_COMPLETED)
          .with("DENIED", () => HANDSHAKE_DENIED)
          .with("IDLE", () => HANDSHAKE_TOCTOC) // should not happen
          .exhaustive();

        const [updated_deal] = await prisma.$transaction([
          prisma.deal.update({
            data: {
              status: Deal_Status_Schema.parse(state.value),
              updated_at: new Date(),
            },
            where: { id: deal.id },
          }),
          prisma.thread.update({
            data: {
              updated_at: new Date(),
              messages: {
                create: {
                  content,
                  author: { connect: { id: profile.id } },
                },
              },
            },
            where: { id: thread_id },
          }),
        ]);

        return updated_deal;
      }),
  }),

  //

  update: next_auth_procedure
    .input(Exchange_Create_Schema.extend({ exchange_id: z.string() }))
    .mutation(({ input, ctx: { prisma, payload } }) => {
      const { category, exchange_id, return: _retrun, ...input_data } = input;
      const { id: profile_id } = payload.profile;
      return prisma.exchange.update({
        data: {
          ...input_data,
          category_id: category,
          return_id: _retrun,
        },
        where: { id: exchange_id, owner: { profile_id } },
      });
    }),
});
