//

import type { Notification_New_Answer_Props } from "@1/modules/notification/domain";
import { New_Answer_Schema_To_Domain } from "@1/modules/notification/infra/strapi";
import { Profile_Record } from "@1/modules/profile/infra/strapi";
import { observable } from "@trpc/server/observable";
import { ZodError, z } from "zod";
import { fromZodError } from "zod-validation-error";
import { UserEmitterMap } from ".";
import { findOneFromUser } from "../api/user-profile/services/user-profile";

//

export class Question_Notification_Observer {
  constructor(private user_id) {}

  observable = observable<Notification_New_Answer_Props>((emit) => {
    const { user_id: id } = this;

    strapi.log.silly(`+ Notification ${id}`);
    const on_new_answer = async (comment_id: number) => {
      strapi.log.silly(
        `*** on_new_answer (user ${id}) (comment_id ${comment_id})`,
      );

      if (Number.isNaN(comment_id)) return;

      const comment = await strapi.entityService.findOne(
        "plugin::comments.comment",
        comment_id,
        { populate: { authorUser: true } },
      );

      const user_id = z.coerce
        .number()
        .describe("The comment author id")
        .parse(comment?.authorUser?.id, { path: ["comment?.authorUser?.id"] });

      const profile_record = await findOneFromUser(user_id);

      const profile = Profile_Record.parse(profile_record, {
        path: ["profile_record"],
      });

      const new_answer_record = {
        answer: { id: Number(comment.id) },
        createdAt: new Date(comment.createdAt),
        profile,
        question: { id: 0 },
        subject: "Q&A",
        type: "NEW_ANSWER",
      };

      const new_answer = new New_Answer_Schema_To_Domain().build(
        new_answer_record,
      );
      if (new_answer.isFail()) return;

      emit.next(new_answer.value().toObject());
      strapi.log.silly(`++ ${id} notifications/on_new_answer`);
    };

    UserEmitterMap.get(id).notifications.on("new_answer", on_new_answer);
    UserEmitterMap.get(id).notifications.on("error", (error) => {
      if (error.name === "ZodError") {
        strapi.log.error(fromZodError(error as ZodError));
        return;
      }

      strapi.log.error(error);
    });
    strapi.log.silly(`+ ${id} notifications`);

    return () => {
      strapi.log.silly(`- ${id} notifications`);
      UserEmitterMap.get(id).notifications.off("new_answer", on_new_answer);
    };
  });
}
