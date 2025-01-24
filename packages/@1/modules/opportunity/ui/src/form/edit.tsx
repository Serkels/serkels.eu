//

import type { Category } from "@1.modules/category.domain";
import { OptionCategories } from "@1.modules/category.ui/form/select";
import { Button } from "@1.ui/react/button";
import { fieldset, input, label, select } from "@1.ui/react/form/atom";
import { Montains } from "@1.ui/react/icons";
import { match } from "ts-pattern";
import { useOpportunityFormContext } from "./schema";

//

export function Edit_Opportunity({ categories }: { categories: Category[] }) {
  const {
    formState: { isSubmitting },
  } = useOpportunityFormContext();

  return (
    <div className="flex flex-col justify-center space-y-5">
      <Title_Field />
      <Expiry_Date_Field />
      <Cover_Field />
      <Description_Field />
      <Location_Field />
      <Category_Field categories={categories} />
      <Website_Field />
      <Button isDisabled={isSubmitting} type="submit">
        Publier
      </Button>
    </div>
  );
}

//

function Category_Field({ categories }: { categories: Category[] }) {
  const {
    register,
    formState: { isSubmitting },
  } = useOpportunityFormContext();

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

function Cover_Field() {
  const {
    register,
    formState: { errors, isSubmitting },
    watch,
  } = useOpportunityFormContext();
  const cover = watch("cover");
  return (
    <fieldset disabled={isSubmitting}>
      <label>
        <span className="text-Silver_Chalice">Couverture</span>

        <input
          {...register("cover")}
          className={input()}
          disabled={isSubmitting}
          required
          type="url"
        />
        {errors.cover && (
          <div className="text-danger">{errors.cover.message}</div>
        )}
        {match(cover)
          .with("", () => (
            <div className="flex min-h-[33vh] items-center justify-center bg-[#BABFC4A8] text-[#919ba3]">
              <Montains />
            </div>
          ))
          .otherwise(() => (
            <div className="flex min-h-[33vh] items-center justify-center bg-[#BABFC4A8] text-[#919ba3]">
              <img
                className="h-auto w-full max-w-full "
                width="700"
                height="368"
                src={cover}
              />
            </div>
          ))}
      </label>
    </fieldset>
  );
}

function Description_Field() {
  const {
    register,
    formState: { errors, isSubmitting },
  } = useOpportunityFormContext();

  return (
    <label>
      <span className="text-Silver_Chalice">Description</span>

      <textarea
        {...register("description")}
        className={input()}
        disabled={isSubmitting}
        required
        rows={5}
      ></textarea>
      {errors.description && (
        <div className="text-danger">{errors.description.message}</div>
      )}
    </label>
  );
}

function Expiry_Date_Field() {
  const {
    register,
    formState: { isSubmitting },
  } = useOpportunityFormContext();

  return (
    <label>
      <span className="text-Silver_Chalice">Date limite ?</span>

      <input
        {...register("expiry_date")}
        className={input()}
        disabled={isSubmitting}
        min={new Date().toISOString().split("T")[0]}
        required
        type="date"
      />
    </label>
  );
}

function Location_Field() {
  const {
    formState: { isSubmitting },
    register,
    setValue,
    watch,
  } = useOpportunityFormContext();

  const location = watch("location");
  const has_location = location !== null;

  return (
    <>
      <fieldset className={fieldset()} disabled={isSubmitting}>
        <label>
          <span>En ligne</span>
          <input
            defaultChecked={!has_location}
            name="has_location"
            onChange={() => setValue("location", null)}
            type="radio"
            value="true"
          />
        </label>
        <label>
          <span>Sur place</span>
          <input
            defaultChecked={has_location}
            name="has_location"
            onChange={() => setValue("location", "")}
            type="radio"
            value="false"
          />
        </label>
      </fieldset>
      <label className={label()}>
        <span className="text-Silver_Chalice">Lieu</span>

        <input
          {...register("location")}
          className={input()}
          disabled={isSubmitting || !has_location}
          required={has_location}
        />
      </label>
    </>
  );
}

function Title_Field() {
  const {
    register,
    formState: { errors, isSubmitting },
  } = useOpportunityFormContext();

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

function Website_Field() {
  const {
    register,
    formState: { errors, isSubmitting },
  } = useOpportunityFormContext();

  return (
    <label>
      <span className="text-Silver_Chalice">Lien web</span>

      <input
        {...register("link")}
        className={input()}
        disabled={isSubmitting}
        required
      />
      {errors.link && <div className="text-danger">{errors.link.message}</div>}
    </label>
  );
}
