//

import { Exchange_TypeSchema } from "@1.modules/exchange.domain";
import { Button } from "@1.ui/react/button";
import { input } from "@1.ui/react/form/atom";
import { PaperPlane } from "@1.ui/react/icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import type { PropsWithChildren } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { createSlot } from "react-slotify";
import { P, match } from "ts-pattern";
import { z } from "zod";
import { OnlineOrLocation } from "../OnlineOrLocation";
import { useOutlet_Exchange, useOutlet_Send } from "./context";

//

export function Ask_Form({ children }: PropsWithChildren) {
  const {
    exchange,
    form: {
      formState: { isSubmitting },
      handleSubmit,
      register,
    },
    on_submit,
  } = use_ask_form();

  return (
    <form className="space-y-6" onSubmit={handleSubmit(on_submit)}>
      <div className="flex flex-row">
        <Ask_Form.AvatarFigure.Renderer childs={children}>
          ...
        </Ask_Form.AvatarFigure.Renderer>
      </div>
      <h3
        className="my-5 line-clamp-2 break-words text-2xl font-bold"
        title={exchange.title}
      >
        {exchange.title}
      </h3>

      <div className="my-2 flex flex-row justify-between">
        <OnlineOrLocation
          is_online={exchange.is_online}
          location={exchange.location ?? ""}
        />
        <time
          className="mt-3 text-xs"
          dateTime={exchange.updated_at.toUTCString()}
          title={exchange.updated_at.toUTCString()}
        >
          {format(exchange.updated_at, "P", { locale: fr })}
        </time>
      </div>

      <textarea
        {...register("message")}
        className={input()}
        disabled={isSubmitting}
        rows={9}
      ></textarea>
      <Button
        type="submit"
        isDisabled={isSubmitting}
        className="mx-auto flex space-x-3"
      >
        <span>Envoyer</span> <PaperPlane className="size-4" />
      </Button>
    </form>
  );
}

Ask_Form.AvatarFigure = createSlot();

//

const form_zod_schema = z.object({
  message: z.string().trim().min(1, "Obligatoire"),
});
type FormValues = z.infer<typeof form_zod_schema>;
function use_ask_form() {
  const exchange = useOutlet_Exchange();
  const send = useOutlet_Send();

  const placeholder = match(exchange)
    .with(
      { return_id: P.nullish, type: Exchange_TypeSchema.Enum.PROPOSAL },
      () => "Bonjour, je veux bien une place.",
    )
    .with(
      { return_id: P.nullish, type: Exchange_TypeSchema.Enum.RESEARCH },
      () => "Bonjour, je veux bien répondre à votre recherche.",
    )
    .otherwise(() => "Bonjour, je veux bien échanger avec vous.");

  const form = useForm({
    defaultValues: { message: placeholder },
    resolver: zodResolver(form_zod_schema),
  });

  const on_submit: SubmitHandler<FormValues> = ({ message }) => {
    send({ state: "creating deal", message });
  };

  return {
    exchange,
    form,
    on_submit,
    send,
  };
}
