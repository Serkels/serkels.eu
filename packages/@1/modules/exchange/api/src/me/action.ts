//

import { StateError } from "@1.modules/core/errors";
import {
  Deal_Status_Schema,
  HANDSHAKE_ACCEPETED,
  HANDSHAKE_COMPLETED,
  HANDSHAKE_DENIED,
  HANDSHAKE_TOCTOC,
} from "@1.modules/exchange.domain";
import { deal_flow } from "@1.modules/exchange.domain/deal.machine";
import { next_auth_procedure } from "@1.modules/trpc";
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
  });
