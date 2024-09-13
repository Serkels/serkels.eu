//

import type { Prisma } from "@1.infra/database";
import { NotificationType } from "@1.infra/database";
import { is_active_exchange } from "@1.modules/exchange.domain";
import { deal_flow } from "@1.modules/exchange.domain/deal.machine";
import {
  next_auth_input_token,
  next_auth_procedure,
  router,
} from "@1.modules/trpc";
import { observable } from "@trpc/server/observable";
import { subDays } from "date-fns";
import { EventEmitter } from "events";
import { createActor } from "xstate";
import { z } from "zod";
import { action } from "./action";

//

class DealEventEmitter extends EventEmitter {}
export const deal_event_emitter = new DealEventEmitter();

export const inbox = router({
  action,
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
      const { id: student_id } = await prisma.student.findUniqueOrThrow({
        select: { id: true },
        where: { profile_id: profile.id },
      });

      const data = await prisma.exchangeThread.findMany({
        ...(cursor ? { cursor: { id: cursor } } : {}),
        orderBy: {
          // deal: { status: "asc" },
          thread: { updated_at: "desc" },
        },
        select: {
          id: true,
          thread: { select: { id: true, updated_at: true } },
        },
        take: limit + 1,
        where: { owner_id: student_id, deal: { parent_id: exchange_id } },
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
      const { id: student_id } = await prisma.student.findUniqueOrThrow({
        select: { id: true },
        where: { profile_id: profile.id },
      });

      const owner_id_thread_id: Prisma.ExchangeThreadOwner_idThread_idCompoundUniqueInput =
        { owner_id: student_id, thread_id };

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
        where: { owner_id_thread_id },
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
        select: {
          owner: { select: { id: true, profile: { select: { id: true } } } },
        },
        where: { id: exchange_id },
      });

      const { id: student_id } = await prisma.student.findUniqueOrThrow({
        select: { id: true },
        where: { profile_id: profile.id },
      });

      return prisma.$transaction(async (prisma_tx) => {
        const { id: thread_id, messages } = await prisma_tx.thread.create({
          data: {
            participants: {
              connect: [{ id: profile.id }, { id: owner_profile_id }],
            },
            messages: { create: { content, author_id: profile.id } },
          },
          select: {
            id: true,
            messages: { take: 1, orderBy: { created_at: "desc" } },
          },
        });

        const [last_message] = messages;
        console.log({ thread_id, messages, last_message });
        if (!last_message) throw new Error("No message created");

        await prisma_tx.exchangeMessageNotification.create({
          data: {
            exchange: { connect: { id: exchange_id } },
            message: { connect: { id: last_message.id } },
            notification: {
              create: {
                owner: { connect: { id: owner_profile_id } },
                type: NotificationType.EXCHANGE_NEW_PARTICIPANT,
              },
            },
          },
          select: { notification_id: true },
        });

        return prisma_tx.deal.create({
          data: {
            parent: { connect: { id: exchange_id } },
            participant: { connect: { id: student_id } },
            exchange_threads: {
              createMany: {
                data: [
                  {
                    owner_id,
                    thread_id,
                    last_seen_date: subDays(new Date(), 1),
                  },
                  {
                    owner_id: student_id,
                    thread_id,
                  },
                ],
              },
            },
          },
          include: {
            exchange_threads: {
              take: 1,
              where: { owner_id: student_id },
            },
          },
        });
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
      const {
        profile: { id: profile_id },
      } = payload;

      const { id: student_id } = await prisma.student.findUniqueOrThrow({
        select: { id: true },
        where: { profile_id },
      });

      const deal = await prisma.deal.findFirstOrThrow({
        select: {
          parent: {
            select: {
              id: true,
              deals: { select: { id: true }, where: { status: "APPROVED" } },
              owner_id: true,
              places: true,
            },
          },
          participant_id: true,
          status: true,
          exchange_threads: {
            where: { owner: { profile_id } },
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
          is_organizer: () => deal.parent.owner_id === student_id,
          is_participant: () => deal.participant_id === student_id,
          is_the_exchange_not_completed: () => is_active_exchange(deal.parent),
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
});
