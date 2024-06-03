"use client";

import { TRPC_React } from ":trpc/client";
import type { Location } from "@1.modules/core/Location";
import { input, select } from "@1.ui/react/form/atom";
import { useDebouncedCallback, useToggle } from "@react-hookz/web";
import type { QueryObserverSuccessResult } from "@tanstack/react-query";
import { type FieldAttributes } from "formik";
import { useState, type ComponentProps } from "react";
import {
  Button,
  ComboBox,
  Group,
  Input,
  ListBox,
  ListBoxItem,
  Popover,
} from "react-aria-components";
import { match } from "ts-pattern";

//

export function FrenchLocationField(
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
  const onChange = useDebouncedCallback<any>(
    (value: string) => set_location(value),
    [set_location],
    200,
    600,
  );

  return (
    <fieldset className="w-full" disabled={props.disabled}>
      <ComboBox onInputChange={onChange}>
        <Group className="flex bg-white bg-opacity-90 shadow-md ring-1 ring-black/10 transition focus-within:bg-opacity-100 focus-visible:ring-2 focus-visible:ring-black">
          <Input className="w-full flex-1 border-none bg-transparent px-3 py-2 text-base leading-5 text-gray-900 outline-none" />
          <Button className="pressed:bg-sky-100 flex items-center border-0 border-l border-solid border-l-sky-200 bg-transparent px-3 text-gray-700 transition">
            {">"}
          </Button>
        </Group>
        <Popover className="w-[--trigger-width] bg-white">
          <ListBox>
            {match(query_info)
              .with({ status: "error" }, () => <FrenchLocationField.Error />)
              .with({ status: "loading" }, (query_info) =>
                props.use_formik ? (
                  <FrenchLocationField.Success
                    {...props}
                    query_info={query_info}
                  />
                ) : (
                  <FrenchLocationField.SuccessFlat
                    {...props}
                    query_info={query_info}
                  />
                ),
              )
              .with({ status: "success" }, (query_info) =>
                props.use_formik ? (
                  <FrenchLocationField.Success
                    {...props}
                    query_info={query_info}
                  />
                ) : (
                  <FrenchLocationField.SuccessFlat
                    {...props}
                    query_info={query_info}
                  />
                ),
              )
              .exhaustive()}
          </ListBox>
        </Popover>
      </ComboBox>
    </fieldset>
  );
}

export function FrenchLocationFieldOld(
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
FrenchLocationField.Error = function Error() {
  return (
    <ListBoxItem
      className={select({ className: "bg-transparent text-danger" })}
    >
      Une erreur est survenue. Veuillez réessayer.
    </ListBoxItem>
  );
};

FrenchLocationField.Loading = function Loading() {
  return <ListBoxItem>Loading...</ListBoxItem>;
};

FrenchLocationField.Success = function Success(
  props: FieldAttributes<{}> & {
    query_info: QueryObserverSuccessResult<Location[]>;
  },
) {
  const {
    query_info: { data },
    name,
    disabled,
  } = props;

  return data?.map(({ nom }) => (
    <ListBoxItem key={nom} id={nom} {...{ name, disabled }}>
      {nom}
    </ListBoxItem>
  ));
};
FrenchLocationField.SuccessFlat = function SuccessFlat(
  props: FieldAttributes<{}> & {
    query_info: QueryObserverSuccessResult<Location[]>;
  },
) {
  const {
    query_info: { data },
    ref,
    ...other_props
  } = props;
  const { className, name, disabled } = other_props;

  return data?.map(({ nom }) => (
    <ListBoxItem
      key={nom}
      id={nom}
      className={className}
      {...{ name, disabled }}
    >
      {nom}
    </ListBoxItem>
  ));
};
