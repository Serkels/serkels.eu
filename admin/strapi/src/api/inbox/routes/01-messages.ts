//

import { errors } from "@strapi/utils";
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
          // create_related_inbox,
          // create_related_threads,
          // "api:inbox.relation",
        ],
        policies: [no_duplicate],
      },
      info: { apiName: "api::inbox.messages", type: "content-api" },
    },
  ],
};

//

async function findOne(filters: { owner: number; participant: number }) {
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
        `findOneFromUser([owner=${filters.owner},participant=${filters.participant}]): detected no profiles`,
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
    findOne({
      participant: Number(profile_id),
      owner: Number(user_id),
    }),
    findOne({
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
