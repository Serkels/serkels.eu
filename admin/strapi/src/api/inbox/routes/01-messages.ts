//

import { Params } from "@strapi/strapi/lib/services/entity-service";
import { errors } from "@strapi/utils";
import { NotFoundError } from "@strapi/utils/dist/errors";
import { z } from "zod";
import { replate_each_body_data_author_by_profile } from "~/src/extensions/comments/services/replace_autor";
import type { Comment, KoaContext, Next } from "~/types";
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

async function find_one_by_id(
  id: number,
  params: Params.Pick<"api::inbox.inbox", "filters">,
) {
  const inbox = await strapi.entityService.findOne("api::inbox.inbox", id, {
    populate: {
      thread: { populate: ["last_message", "participants"] },
      participant: true,
    },
    ...params,
  });

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
  owner_id: number;
  participant_id: number;
}) {
  const inboxes = await strapi.entityService.findMany("api::inbox.inbox", {
    filters: {
      $or: [
        { owner: { id: filters.owner_id } as any },
        { participant: { id: filters.participant_id } as any },
      ],
    },
  });

  const [inbox] = inboxes;
  if (Number.isNaN(inbox.id)) {
    strapi.log.warn(
      `service::user-profile.user-profile > ` +
        `findOneFromUser([owner=${filters.owner_id},participant=${filters.participant_id}]): detected no inbox`,
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
      participant_id: Number(profile_id),
      owner_id: Number(user_id),
    }),
    find_one_by_pair({
      participant_id: Number(user_id),
      owner_id: Number(user_id),
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
    Params.Pick<"api::inbox.inbox", "data">,
    Comment,
    { profile_id: string }
  >,
  next: Next,
) {
  const profile_id = Number(context.params.profile_id);
  const user_id = Number(context.state.user.id);

  //

  context.request.body = {
    data: { participant: profile_id, owner: user_id },
  };

  //
  //
  //

  return next();
}

async function create_related_inbox(
  context: KoaContext<
    Params.Pick<"api::inbox.inbox", "data">,
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

  const profile_id = z.number().parse(context.params.profile_id);
  const user_id = z.number().parse(context.state.user.id);

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

  const related_inbox = await strapi.entityService.create("api::inbox.inbox", {
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

  const thread = await strapi.entityService.create("api::thread.thread", {
    data: {
      inboxes: [inbox.id, related_inbox.id],
      participants: [profile_id, related_profile.id],
    },
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
    const user_id = z.number().parse(ctx.state.user.id);

    const inbox = await find_one_by_id(params.id, {
      filters: { owner: { id: user_id } as any },
    });

    if (!inbox) {
      throw new NotFoundError('Missing inbox"');
    }

    const thread = z.object({ id: z.coerce.number() }).parse(inbox.thread);
    if (Number.isNaN(thread.id)) {
      // TODO (douglasduteil) Might want to remove this or parseSafe the assertion above
      strapi.log.warn(
        `api::inbox.01-messages > ` +
          `set_default_relation_param([ctx.params.id=${params.id}]): detected no thread`,
      );
      throw new NotFoundError("Missing inbox thread");
    }

    strapi.log.debug(`redirect to api::thread.thread:${thread.id}`);
    ctx.params = {
      ...(ctx.params ?? {}),
      relation: `api::thread.thread:${thread.id}`,
    };
    return next();
  };
}
