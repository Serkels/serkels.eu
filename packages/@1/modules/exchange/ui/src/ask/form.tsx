//

import { Button } from "@1.ui/react/button";
import { input } from "@1.ui/react/form/atom";
import { PaperPlane } from "@1.ui/react/icons";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Field, Form, Formik } from "formik";
import type { PropsWithChildren } from "react";
import { createSlot } from "react-slotify";
import { OnlineOrLocation } from "../OnlineOrLocation";
import { useOutlet_Exchange, useOutlet_Send } from "./context";

//

export function Ask_Form({ children }: PropsWithChildren) {
  const exchange = useOutlet_Exchange();
  const send = useOutlet_Send();

  return (
    <>
      <div className="flex flex-row">
        <Ask_Form.AvatarFigure.Renderer childs={children}>
          ...
        </Ask_Form.AvatarFigure.Renderer>
      </div>
      <h3
        className="my-5 line-clamp-2 text-2xl font-bold"
        title={exchange.title}
      >
        {exchange.title}
      </h3>

      <div className="my-2  flex flex-row justify-between">
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

      <Formik
        initialValues={{ message: "" }}
        onSubmit={(value) =>
          send({ state: "creating deal", message: value.message })
        }
      >
        {({ isSubmitting }) => (
          <Form className="space-y-7">
            <Field
              as="textarea"
              className={input()}
              name="message"
              rows={9}
              disabled={isSubmitting}
              placeholder="Bonjour ! Je veux bien apprendre le français avec toi !"
            />
            <Button
              type="submit"
              isDisabled={isSubmitting}
              className="mx-auto flex space-x-3"
            >
              <span>Envoyer</span> <PaperPlane className="size-4" />
            </Button>
          </Form>
        )}
      </Formik>
    </>
  );
}

Ask_Form.AvatarFigure = createSlot();
