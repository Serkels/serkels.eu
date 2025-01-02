"use client";

import { TRPC_React } from ":trpc/client";
import type { Location } from "@1.modules/core/Location";
import { input, select } from "@1.ui/react/form/atom";
import { useDebouncedCallback, useToggle } from "@react-hookz/web";
import type { QueryObserverSuccessResult } from "@tanstack/react-query";
import { Field, type FieldAttributes } from "formik";
import { useState, type ComponentProps } from "react";
import { match } from "ts-pattern";

//

export function FrenchLocationField(props: ComponentProps<"input">) {
  return <input className={input()} {...props} />;
}

/**
 *
 * @deprecated see https://github.com/toctocorg/toctoc/pull/1315
 */
export function _FrenchLocationField(
  props: FieldAttributes<{ use_formik?: boolean }>,
) {
  const [location, set_location] = useState(
    String(props.defaultValue ?? "Paris"),
  );
  const [searching, toggle_searching] = useToggle(false);
  const query_info = TRPC_React.locations.useQuery(
    { location },
    { staleTime: Infinity },
  );

  const onChange = useDebouncedCallback<
    NonNullable<ComponentProps<"input">["onChange"]>
  >((ev) => set_location(ev.target.value), [set_location], 1666, 500);

  return (
    <fieldset className="w-full" disabled={props.disabled}>
      <button
        type="button"
        className="float-right text-sm text-Silver_Chalice"
        onClick={toggle_searching}
      >
        Rechercher par nom
      </button>
      {searching ? (
        <label className="my-1 block">
          <span className="float-left text-sm text-Silver_Chalice">
            Ça commance par
          </span>
          <input
            className={input({ className: "opacity-85", tv$size: "xs" })}
            defaultValue={location}
            onChange={onChange}
            type="search"
          />
        </label>
      ) : null}
      {match(query_info)
        .with({ status: "error" }, () => <FrenchLocationField.Error />)
        .with({ status: "loading" }, () => <FrenchLocationField.Loading />)
        .with({ status: "success" }, (query_info) =>
          props.use_formik ? (
            <FrenchLocationField.Success {...props} query_info={query_info} />
          ) : (
            <FrenchLocationField.SuccessFlat
              {...props}
              query_info={query_info}
            />
          ),
        )
        .exhaustive()}
    </fieldset>
  );
}

FrenchLocationField.Error = function Loading() {
  return (
    <select
      className={select({ className: "bg-transparent text-danger" })}
      disabled={true}
    >
      <option hidden value={""}>
        Une erreur est survenue. Veuillez réessayer.
      </option>
    </select>
  );
};

FrenchLocationField.Loading = function Loading() {
  return (
    <select className={select()} disabled={true}>
      <option hidden value={""}>
        Loading...
      </option>
    </select>
  );
};

FrenchLocationField.Success = function Loading(props: {
  query_info: QueryObserverSuccessResult<Location[]>;
}) {
  const {
    query_info: { data },
    ...other_props
  } = props;

  if (data.length === 0)
    return (
      <select className={select()} disabled={true}>
        <option hidden value={""}>
          Pas trouvé...
        </option>
      </select>
    );
  return (
    <Field component="select" className={select()} {...other_props}>
      {data.map(({ nom }) => (
        <option key={nom} value={nom}>
          {nom}
        </option>
      ))}
    </Field>
  );
};
FrenchLocationField.SuccessFlat = function Loading(
  props: {
    query_info: QueryObserverSuccessResult<Location[]>;
  } & ComponentProps<"select">,
) {
  const {
    query_info: { data },
    ...other_props
  } = props;
  const { className, name, id, disabled } = other_props;
  if (data.length === 0)
    return (
      <select
        className={select({ className })}
        disabled={true}
        {...{ name, id }}
      >
        <option hidden value={""}>
          Pas trouvé...
        </option>
      </select>
    );
  return (
    <select className={select({ className })} {...{ name, disabled, id }}>
      {data.map(({ nom }) => (
        <option key={nom} value={nom}>
          {nom}
        </option>
      ))}
    </select>
  );
};
