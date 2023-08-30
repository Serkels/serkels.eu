//

import { errors } from "@strapi/utils";
import { NotFoundError } from "@strapi/utils/dist/errors";
import { z } from "zod";
import { replate_each_body_data_author_by_profile } from "~/src/extensions/comments/services/replace_autor";
import type {
  Comment,
  EntityService,
  GetValues,
  KoaContext,
  Next,
} from "~/types";
import {
  findOneFromUser,
  findRelatedUser,
} from "../../user-profile/services/user-profile";
import { set_default_populate } from "../middlewares/set_default_populate";

//

export default {
  routes: [
    // {
    //   method: "GET",
    //   path: "/inbox/threads",
    //   handler: "api::inbox.messages.find",
    //   config: {
    //     description: "Get an inbox messages",
    //     middlewares: [set_default_relation_param()],
    //     policies: [],
    //   },
    //   info: { apiName: "api::inbox.messages.find", type: "content-api" },
    // },

    {
      method: "GET",
      path: "/inbox/:id/messages",
      handler: "api::inbox.messages.find",
      config: {
        description: "Get an inbox messages",
        middlewares: [
          set_default_relation_param(),
          //
          //
          //
          replate_each_body_data_author_by_profile(),
        ],
        policies: [
          {
            name: "global::params-z-shema",
            config: {
              schema: z.object({
                id: z.coerce.number().safe().finite().nonnegative().int(),
              }),
            },
          },
        ],
      },
      info: { apiName: "api::inbox.messages.find", type: "content-api" },
    },

    {
      method: "POST",
      path: "/inbox/:id/messages",
      handler: "api::inbox.messages.create",
      config: {
        description: "Get an inbox messages",
        middlewares: [
          set_default_relation_param(),
          //
          //
          //
        ],
        policies: [
          {
            name: "global::params-z-shema",
            config: {
              schema: z.object({
                id: z.coerce.number().safe().finite().nonnegative().int(),
              }),
            },
          },
          "global::is-owned",
        ],
      },
      info: { apiName: "api::inbox.messages.create", type: "content-api" },
    },

    {
      method: "POST",
      path: "/inbox/to/:profile_id",
      handler: "api::inbox.inbox.create",
      config: {
        description: "Get question answers",
        middlewares: [
          set_default_populate,
          create_inbox,
          //
          //
          //
          create_related_inbox,
        ],
        policies: [
          {
            name: "global::params-z-shema",
            config: {
              schema: z.object({
                profile_id: z.coerce
                  .number()
                  .safe()
                  .finite()
                  .nonnegative()
                  .int(),
              }),
            },
          },
          no_duplicate,
        ],
      },
      info: { apiName: "api::inbox.inbox.create", type: "content-api" },
    },
  ],
};

//

async function find_one_by_id(id: number, filters: { owner: number }) {
  const entityService: EntityService = strapi.entityService;
  const entity = await entityService.findOne<
    "api::inbox.inbox",
    GetValues<"api::inbox.inbox">
  >("api::inbox.inbox", id, {
    populate: {
      thread: { populate: ["last_message", "participants"] },
      participant: true,
    },
    filters,
  });

  const inbox = { id: NaN, ...(entity ?? {}) };
  if (Number.isNaN(inbox.id)) {
    strapi.log.warn(
      `service::user-profile.user-profile > ` +
        `findOneFromUser([id=${id}]): detected no inbox`,
    );
    return undefined;
  }

  return inbox;
}

async function find_one_by_pair(filters: {
  owner: number;
  participant: number;
}) {
  const entityService: EntityService = strapi.entityService;
  const inboxes = await entityService.findMany<
    "api::inbox.inbox",
    GetValues<"api::inbox.inbox">
  >("api::inbox.inbox", {
    filters: filters,
  });

  const inbox = { id: NaN, ...(inboxes[0] ?? {}) };
  if (Number.isNaN(inbox.id)) {
    strapi.log.warn(
      `service::user-profile.user-profile > ` +
        `findOneFromUser([owner=${filters.owner},participant=${filters.participant}]): detected no inbox`,
    );
    return undefined;
  }

  return inbox;
}

async function no_duplicate(context, _cfg, { strapi }) {
  const profile_id = Number(context.params.profile_id);
  const user_id = context.state.user.id;

  if (Number.isNaN(profile_id)) {
    throw new errors.PolicyError(
      `api::inbox.inbox Missing target [participant=${profile_id}]`,
      {
        policy: "no_duplicate",
      },
    );
  }

  const inbox = await Promise.race([
    find_one_by_pair({
      participant: Number(profile_id),
      owner: Number(user_id),
    }),
    find_one_by_pair({
      participant: Number(user_id),
      owner: Number(user_id),
    }),
  ]);

  if (!inbox) {
    return true;
  }

  throw new errors.PolicyError(
    `api::inbox.inbox Duplicate [owner=${user_id},participant=${profile_id}]`,
    {
      policy: "no_duplicate",
    },
  );
}

async function create_inbox(
  context: KoaContext<
    { data: GetValues<"api::inbox.inbox"> },
    Comment,
    { profile_id: string }
  >,
  next: Next,
) {
  const profile_id = context.params.profile_id;
  const user_id = context.state.user.id;
  context.request.body = {
    data: { participant: profile_id as any, owner: user_id as any },
  };

  //
  //
  //

  return next();
}

async function create_related_inbox(
  context: KoaContext<
    { data: GetValues<"api::inbox.inbox"> },
    { data: { id: number } },
    { profile_id: string }
  >,
  next: Next,
) {
  //
  //
  //

  await next();

  //
  //
  //

  const profile_id = context.params.profile_id;
  const user_id = context.state.user.id;
  const entityService: EntityService = strapi.entityService;

  const [related_profile, participant_user] = await Promise.all([
    findOneFromUser(Number(user_id)),
    findRelatedUser(Number(profile_id)),
  ]);

  if (!participant_user) {
    return context.send({ error: "UnprocessableEntity" }, 422);
  }

  const related_inbox_data = {
    participant: related_profile.id,
    owner: participant_user.id,
  };

  const related_inbox = await entityService.create<
    "api::inbox.inbox",
    GetValues<"api::inbox.inbox">
  >("api::inbox.inbox", {
    data: related_inbox_data,
  });

  strapi.log.info(
    `CREATE api::inbox.inbox [owner=${participant_user.id},participant=${related_profile.id}]`,
  );

  const inbox = context.body.data;

  //

  if (!inbox) {
    throw new errors.ApplicationError(
      `api::inbox.inbox no inbox [owner=${user_id},participant=${profile_id}]`,
      {
        middleware: "create_related_inbox",
      },
    );
  }

  //

  const related_thread = {
    inboxes: [inbox.id, related_inbox.id],
    participants: [profile_id, related_profile.id],
  };

  const thread = await entityService.create("api::thread.thread", {
    data: related_thread,
  });
  if (!thread) {
    throw new errors.ApplicationError(
      `api::inbox.inbox no thread [owner=${user_id},participant=${profile_id}]`,
      {
        middleware: "create_related_inbox",
      },
    );
  }

  strapi.log.info(
    `CREATE api::thread.thread  [owner=${participant_user.id},participant=${related_profile.id}] => ${thread.id}`,
    {
      participant: related_profile.id,
      owner: participant_user.id,
    },
  );
}

//

function set_default_relation_param() {
  return async function relation(ctx: KoaContext, next: Next) {
    const { params } = ctx;
    const user_id = ctx.state.user.id;

    const inbox = await find_one_by_id(params.id, { owner: Number(user_id) });

    if (!inbox) {
      throw new NotFoundError('Missing inbox"');
    }

    const { id: thread_id } = { id: NaN, ...(inbox.thread ?? {}) };
    if (Number.isNaN(thread_id)) {
      strapi.log.warn(
        `api::inbox.01-messages > ` +
          `set_default_relation_param([ctx.params.id=${params.id}]): detected no thread`,
      );
      throw new NotFoundError("Missing inbox thread");
    }

    strapi.log.debug(`redirect to api::thread.thread:${thread_id}`);
    ctx.params = {
      ...(ctx.params ?? {}),
      relation: `api::thread.thread:${thread_id}`,
    };
    return next();
  };
}
