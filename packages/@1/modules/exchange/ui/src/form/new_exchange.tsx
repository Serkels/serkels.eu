//
"use client";

import type { Category } from "@1.modules/category.domain";
import { OptionCategories } from "@1.modules/category.ui/form/select";
import { ID_Schema } from "@1.modules/core/domain";
import type { Location } from "@1.modules/core/Location";
import { Exchange_TypeSchema } from "@1.modules/exchange.domain";
import { Button } from "@1.ui/react/button";
import { fieldset, input, select } from "@1.ui/react/form/atom";
import {
  ComboBox,
  Input,
  Label,
  ListBox,
  ListBoxItem,
  Popover,
} from "react-aria-components";
import { useFormContext } from "react-hook-form";
import { tv } from "tailwind-variants";
import { z } from "zod";
import { TRPC_React } from "/home/ls/github/toctocorg/toctoc/apps/www/trpc/client";

//

export const form_zod_schema = z.object({
  description: z
    .string({ required_error: "Ce champs est requis" })
    .trim()
    .min(10, "La description doit contenir 10 caractères minimum")
    .max(705, "La description doit contenir 705 caractères maximum"),
  is_online: z.enum(["true", "false"]),
  location: z.string({ required_error: "Ce champs est requis" }).nullish(),
  places: z.coerce
    .number()
    .int()
    .min(1, "Le nombre minimal de participant est de 1")
    .max(9, "Le nombre maximal de participants est de 9"),
  title: z
    .string({ required_error: "Ce champs est requis" })
    .trim()
    .min(10, "Le titre doit contenir 10 caractères minimum")
    .max(100, "La description doit contenir 100 caractères maximum"),
  type: Exchange_TypeSchema,
  category_id: ID_Schema,
  return_id: ID_Schema.nullable(),
  expiry_date: z.string().nullable(),
});

export type FormValues = z.infer<typeof form_zod_schema>;

export function form_to_dto(form: FormValues) {
  return {
    ...form,
    expiry_date: form.expiry_date ? new Date(form.expiry_date) : null,
    is_online: form.is_online === "true",
    return_id: form.return_id === "" ? null : form.return_id,
  };
}

//

export function Exchange_EditForm({ categories }: { categories: Category[] }) {
  const {
    formState: { isSubmitting },
  } = useFormContext<FormValues>();

  return (
    <div className="flex flex-col justify-center space-y-5">
      <Type_Field />
      <IsOnline_Field />
      <Location_Field />
      <Category_Field categories={categories} />
      <Expiry_Date_Field />
      <Title_Field />
      <Description_Field />
      <Places_Field />
      <Return_Field categories={categories} />

      <Button isDisabled={isSubmitting} type="submit">
        Publier
      </Button>
    </div>
  );
}

//

function Type_Field() {
  const {
    register,
    formState: { isSubmitting },
  } = useFormContext<FormValues>();

  return (
    <fieldset className={fieldset()} disabled={isSubmitting}>
      <label>
        <span>Je cherche</span>
        <input
          {...register("type")}
          required
          type="radio"
          value={Exchange_TypeSchema.Enum.RESEARCH}
        />
      </label>
      <label>
        <span>Je propose</span>
        <input
          {...register("type")}
          required
          type="radio"
          value={Exchange_TypeSchema.Enum.PROPOSAL}
        />
      </label>
    </fieldset>
  );
}

function IsOnline_Field() {
  const {
    register,
    formState: { isSubmitting },
  } = useFormContext<FormValues>();

  return (
    <fieldset className={fieldset()} disabled={isSubmitting}>
      <label>
        <span>En ligne</span>{" "}
        <input {...register("is_online")} value="true" required type="radio" />
      </label>
      <label>
        <span>Sur place</span>{" "}
        <input {...register("is_online")} value="false" required type="radio" />
      </label>
    </fieldset>
  );
}

function Location_Field() {
  const {
    register,
    watch,
    formState: { isSubmitting },
  } = useFormContext<FormValues>();

  if (watch("is_online") === "true") {
    return null;
  }

  const location = watch("location") || "";

  const query_info = TRPC_React.locations.useQuery(
    { location },
    { staleTime: Infinity },
  );

  const data = query_info.data;

  const item = tv({ base: `flex justify-between` });

  return (
    <label>
      {/* <span className="text-Silver_Chalice">Ville</span> */}
      <ComboBox>
        <Label className="text-Silver_Chalice">Ville</Label>
        <div>
          <Input
            className={input()}
            disabled={isSubmitting}
            {...register("location")}
            required
          />
        </div>
        <Popover className="w-[--trigger-width] bg-white p-4 outline-none">
          <ListBox>
            {data?.map((location: Location) => (
              <ListBoxItem
                key={`${location.nom}-${location.departement.code}`}
                id={location.nom}
                textValue={location.nom}
                className={item()}
              >
                {location.nom}
                <span>
                  {location.departement.nom}-{location.departement.code}
                </span>
              </ListBoxItem>
            ))}
          </ListBox>
        </Popover>
      </ComboBox>
      {/* <input
        {...register("location")}
        className={input()}
        disabled={isSubmitting}
        required
      /> */}
    </label>
  );
}

function Category_Field({ categories }: { categories: Category[] }) {
  const {
    register,
    formState: { isSubmitting },
  } = useFormContext<FormValues>();

  return (
    <label>
      <span className="text-Silver_Chalice">Dans quelle categorie ?</span>

      <select
        {...register("category_id")}
        className={select()}
        disabled={isSubmitting}
        required
      >
        <option hidden value="">
          Dans quelle categorie ?
        </option>
        <OptionCategories categories={categories} />
      </select>
    </label>
  );
}

function Expiry_Date_Field() {
  const {
    register,
    formState: { isSubmitting },
  } = useFormContext<FormValues>();

  return (
    <label>
      <span className="text-Silver_Chalice">Date limite ?</span>

      <input
        {...register("expiry_date")}
        type="date"
        className={input()}
        disabled={isSubmitting}
        min={new Date().toISOString().split("T")[0]}
      />
    </label>
  );
}

function Title_Field() {
  const {
    register,
    formState: { errors, isSubmitting },
  } = useFormContext<FormValues>();

  return (
    <label>
      <span className="text-Silver_Chalice">Titre</span>

      <input
        {...register("title")}
        className={input()}
        disabled={isSubmitting}
        required
      />
      {errors.title && (
        <div className="text-danger">{errors.title.message}</div>
      )}
    </label>
  );
}

function Description_Field() {
  const {
    register,
    formState: { errors, isSubmitting },
  } = useFormContext<FormValues>();

  return (
    <label>
      <span className="text-Silver_Chalice">Description</span>

      <textarea
        {...register("description")}
        className={input()}
        disabled={isSubmitting}
        required
      ></textarea>
      {errors.description && (
        <div className="text-danger">{errors.description.message}</div>
      )}
    </label>
  );
}

function Places_Field() {
  const {
    register,
    formState: { errors, isSubmitting },
  } = useFormContext<FormValues>();

  return (
    <label>
      <span className="text-Silver_Chalice">Nombre de places</span>

      <input
        {...register("places")}
        className={input()}
        disabled={isSubmitting}
        maxLength={9}
        minLength={1}
        required
        type="number"
      />
      {errors.places && (
        <div className="text-danger">{errors.places.message}</div>
      )}
    </label>
  );
}

function Return_Field({ categories }: { categories: Category[] }) {
  const {
    register,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useFormContext<FormValues>();
  const return_id = watch("return_id");
  const has_return = Boolean(return_id);

  return (
    <>
      <fieldset
        className={fieldset({ horizontal: true })}
        disabled={isSubmitting}
      >
        <label className="flex md:gap-2">
          <input
            className="peer"
            checked={!has_return}
            disabled={isSubmitting}
            onChange={() => setValue("return_id", "")}
            type="radio"
          />
          <span className="peer-checked:font-semibold">Sans échange</span>
        </label>
        <label className="flex md:gap-2">
          <input
            className="peer"
            checked={has_return}
            disabled={isSubmitting}
            onChange={() => setValue("return_id", `${register("return_id")}`)}
            type="radio"
          />
          <div className="flex gap-2">
            <span
              className={["w-max", has_return ? "font-semibold" : ""].join(" ")}
            >
              Contre un échange
            </span>
          </div>
        </label>
        {errors.return_id && (
          <div className="text-danger">{errors.return_id.message}</div>
        )}{" "}
      </fieldset>
      <select
        {...register("return_id")}
        disabled={!has_return}
        className={select()}
        required={has_return}
      >
        <option disabled selected value="">
          Dans quelle categorie ?
        </option>
        <OptionCategories categories={categories} />
      </select>
    </>
  );
}
