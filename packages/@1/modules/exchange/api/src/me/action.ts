//

import { NotificationType } from "@1.infra/database";
import { StateError } from "@1.modules/core/errors";
import {
  Deal_Status_Schema,
  HANDSHAKE_ACCEPETED,
  HANDSHAKE_COMPLETED,
  HANDSHAKE_DENIED,
  HANDSHAKE_TOCTOC,
} from "@1.modules/exchange.domain";
import { deal_flow } from "@1.modules/exchange.domain/deal.machine";
import { is_exchange_completed } from "@1.modules/exchange.domain/is_exchange_completed";
import { thread_recipient } from "@1.modules/inbox.domain/select";
import { next_auth_procedure, type Context } from "@1.modules/trpc";
import { match } from "ts-pattern";
import { createActor } from "xstate";
import { z } from "zod";

//

export const action = next_auth_procedure
  .input(
    z.object({
      exchange_id: z.string(),
      thread_id: z.string(),
      action: z.enum(["APPROVE", "DENIE"]),
    }),
  )
  .mutation(async ({ ctx: { payload, prisma }, input }) => {
    const { action, exchange_id, thread_id } = input;
    const updated_at = new Date();
    const {
      profile: { id: profile_id },
    } = payload;
    const { id: student_id } = await prisma.student.findUniqueOrThrow({
      select: { id: true },
      where: { profile_id },
    });

    const deal = await prisma.deal.findFirstOrThrow({
      include: {
        parent: {
          select: {
            id: true,
            deals: {
              select: { id: true },
              where: { status: Deal_Status_Schema.Enum.APPROVED },
            },
            owner_id: true,
            places: true,
          },
        },
        exchange_threads: {
          where: { owner_id: student_id },
          include: { thread: true },
        },
        participant: { select: { profile_id: true } },
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
        is_the_exchange_not_completed: () =>
          !is_exchange_completed(deal.parent),
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
      .with(
        Deal_Status_Schema.Enum.APPROVED_BY_THE_ORGANIZER,
        () => HANDSHAKE_ACCEPETED,
      )
      .with(Deal_Status_Schema.Enum.APPROVED, () => HANDSHAKE_ACCEPETED)
      .with(Deal_Status_Schema.Enum.DENIED, () => HANDSHAKE_DENIED)
      .with(Deal_Status_Schema.Enum.IDLE, () => HANDSHAKE_TOCTOC) // should not happen
      .exhaustive();

    const { participants } = await prisma.thread.findUniqueOrThrow({
      select: { participants: { select: { id: true } } },
      where: { id: thread_id, participants: { some: { id: profile_id } } },
    });
    const recipient = thread_recipient({ participants, profile_id });
    const is_archived = state.value === Deal_Status_Schema.Enum.DENIED;

    await prisma.thread.update({
      data: {
        updated_at,
        exchange_threads: {
          update: {
            data: {
              deal: {
                update: {
                  updated_at,
                  status: Deal_Status_Schema.parse(state.value),
                },
              },
              is_archived,
            },
            where: {
              owner_id_thread_id: { owner_id: student_id, thread_id },
            },
          },
        },
        messages: {
          create: {
            author: { connect: { id: profile_id } },
            content,
            exchange_notifications: {
              create: {
                exchange: { connect: { id: deal.parent.id } },
                notification: {
                  create: {
                    owner_id: recipient.id,
                    type: NotificationType.EXCHANGE_NEW_MESSAGE,
                  },
                },
              },
            },
          },
        },
      },
      select: {
        id: true,
      },
      where: { id: thread_id },
    });

    return exchange_completed({ ctx: { prisma }, input: { exchange_id } });
  });

async function exchange_completed({
  ctx: { prisma },
  input: { exchange_id },
}: {
  ctx: Pick<Context, "prisma">;
  input: { exchange_id: string };
}) {
  const updated_at = new Date();
  const exchange = await prisma.exchange.findUniqueOrThrow({
    select: {
      places: true,
      owner: { select: { profile_id: true } },
      deals: {
        select: {
          id: true,
          exchange_threads: { select: { thread_id: true } },
        },
        where: { status: Deal_Status_Schema.Enum.APPROVED },
      },
    },
    where: { id: exchange_id },
  });

  if (!is_exchange_completed(exchange)) {
    return exchange;
  }

  const exchange_threads = await prisma.exchangeThread.findMany({
    distinct: ["thread_id"],
    select: {
      id: true,
      deal: { select: { participant: { select: { profile_id: true } } } },
      thread: { select: { id: true } },
    },
    where: {
      deal: {
        status: Deal_Status_Schema.Enum.APPROVED,
        parent: { id: exchange_id },
      },
    },
  });

  await prisma.$transaction(async (prisma_tx) => {
    for (const { thread, deal } of exchange_threads) {
      const message = await prisma_tx.message.create({
        data: {
          author: { connect: { id: exchange.owner.profile_id } },
          content: HANDSHAKE_COMPLETED,
          thread: { connect: { id: thread.id } },
        },
        select: { id: true },
      });

      await prisma_tx.exchangeMessageNotification.create({
        data: {
          exchange: { connect: { id: exchange_id } },
          notification: {
            create: {
              type: NotificationType.EXCHANGE_COMPLETED,
              owner: { connect: { id: deal.participant.profile_id } },
            },
          },
          message: { connect: { id: message.id } },
        },
      });
    }
    const message = await prisma_tx.message.findFirstOrThrow({
      select: { id: true },
      where: { content: HANDSHAKE_COMPLETED },
    });
    await prisma_tx.exchangeMessageNotification.create({
      data: {
        exchange: { connect: { id: exchange_id } },
        message: { connect: { id: message.id } },
        notification: {
          create: {
            type: NotificationType.EXCHANGE_COMPLETED,
            owner: { connect: { id: exchange.owner.profile_id } },
          },
        },
      },
    });
  });

  return prisma.$transaction([
    prisma.exchange.update({
      data: {
        is_active: false,
        updated_at,
        deals: {
          updateMany: {
            data: { updated_at },
            where: {
              parent_id: exchange_id,
              status: Deal_Status_Schema.Enum.APPROVED,
            },
          },
        },
      },
      where: { id: exchange_id },
    }),

    prisma.thread.updateMany({
      data: { updated_at },
      where: {
        exchange_threads: {
          some: {
            deal: {
              status: Deal_Status_Schema.Enum.APPROVED,
              parent: { id: exchange_id },
            },
          },
        },
      },
    }),
  ]);
}
