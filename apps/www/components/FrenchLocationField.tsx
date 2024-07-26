"use client";

import { TRPC_React } from ":trpc/client";
import { input } from "@1.ui/react/form/atom";
import { useEffect, useState } from "react";
import {
  Button,
  ComboBox,
  Input,
  ListBox,
  ListBoxItem,
  Popover,
  type Key,
} from "react-aria-components";
import { useForm } from "react-hook-form";
import { tv } from "tailwind-variants";

//

// export function FrenchLocationField(props: ComponentProps<"input">) {
//   return <input className={input()} {...props} />;
// }

interface FormValues {
  location: string;
}

export function FrenchLocationField() {
  const { watch, setValue } = useForm<FormValues>({
    defaultValues: { location: "" },
  });
  const [location, set_location] = useState(String);

  const query_info = TRPC_React.locations.useQuery(
    { location },
    { staleTime: Infinity },
  );
  const watchedLocation = watch("location", "Paris");

  useEffect(() => {
    set_location(watchedLocation);
  }, [watchedLocation]);

  // const onChange = (watchedLocation: string) => {
  //   set_location(watchedLocation);
  //   setValue("location", watchedLocation); // Met à jour la valeur du formulaire
  // };
  const onChange = (value: string) => {
    set_location(value);
    setValue("location", value); // Met à jour la valeur du formulaire
  };

  const handleSelectionChange = (key: Key | null) => {
    const selectedItem = query_info.data?.find((item) => item.code === key);

    console.log(selectedItem);
    console.log("Selected key:", key);
    console.log("Query data:", query_info.data);

    if (selectedItem) {
      onChange(selectedItem.nom); // Met à jour avec le nom de la ville
    }
  };

  console.log(query_info);

  return (
    <ComboBox
      inputValue=""
      name="location"
      selectedKey={location}
      onSelectionChange={handleSelectionChange}
    >
      <Input
        defaultValue=""
        className={input()}
        onChange={(e) => onChange(e.target.value)}
        value={location}
      />
      <Button>{">"}</Button>
      <Popover className={popover()}>
        <ListBox>
          {query_info.data?.map(({ nom, code }) => (
            <ListBoxItem className="flex justify-between" key={code}>
              <div>{nom}</div>
              <div>{code}</div>
            </ListBoxItem>
          ))}
        </ListBox>
      </Popover>
    </ComboBox>
  );
}

export default FrenchLocationField;

const popover = tv({
  base: `
    w-[--trigger-width]
    bg-white
    px-6
    py-2
    text-black
    drop-shadow-lg
  `,
});

/**
 *
 * @deprecated see https://github.com/toctocorg/toctoc/pull/1315
//  */
// export function _FrenchLocationField(
//   props: FieldAttributes<{ use_formik?: boolean }>,
// ) {
//   const [location, set_location] = useState(
//     String(props.defaultValue ?? "Paris"),
//   );
//   const [searching, toggle_searching] = useToggle(false);
//   const query_info = TRPC_React.locations.useQuery(
//     { location },
//     { staleTime: Infinity },
//   );

//   const onChange = useDebouncedCallback<
//     NonNullable<ComponentProps<"input">["onChange"]>
//   >((ev) => set_location(ev.target.value), [set_location], 1666, 500);

//   return (
//     <fieldset className="w-full" disabled={props.disabled}>
//       <button
//         type="button"
//         className="float-right text-sm text-Silver_Chalice"
//         onClick={toggle_searching}
//       >
//         Rechercher par nom
//       </button>
//       {searching ? (
//         <label className="my-1 block">
//           <span className="float-left text-sm text-Silver_Chalice">
//             Ça commance par
//           </span>
//           <input
//             className={input({ className: "opacity-85", tv$size: "xs" })}
//             defaultValue={location}
//             onChange={onChange}
//             type="search"
//           />
//         </label>
//       ) : null}
//       {match(query_info)
//         .with({ status: "error" }, () => <FrenchLocationField.Error />)
//         .with({ status: "loading" }, () => <FrenchLocationField.Loading />)
//         .with({ status: "success" }, (query_info) =>
//           props.use_formik ? (
//             <FrenchLocationField.Success {...props} query_info={query_info} />
//           ) : (
//             <FrenchLocationField.SuccessFlat
//               {...props}
//               query_info={query_info}
//             />
//           ),
//         )
//         .exhaustive()}
//     </fieldset>
//   );
// }

// FrenchLocationField.Error = function Loading() {
//   return (
//     <select
//       className={select({ className: "bg-transparent text-danger" })}
//       disabled={true}
//     >
//       <option hidden value={""}>
//         Une erreur est survenue. Veuillez réessayer.
//       </option>
//     </select>
//   );
// };

// FrenchLocationField.Loading = function Loading() {
//   return (
//     <select className={select()} disabled={true}>
//       <option hidden value={""}>
//         Loading...
//       </option>
//     </select>
//   );
// };

// FrenchLocationField.Success = function Loading(
//   props: FieldAttributes<{}> & {
//     query_info: QueryObserverSuccessResult<Location[]>;
//   },
// ) {
//   const {
//     query_info: { data },
//     ...other_props
//   } = props;

//   if (data.length === 0)
//     return (
//       <select className={select()} disabled={true}>
//         <option hidden value={""}>
//           Pas trouvé...
//         </option>
//       </select>
//     );
//   return (
//     <Field component="select" className={select()} {...other_props}>
//       {data.map(({ nom }) => (
//         <option key={nom} value={nom}>
//           {nom}
//         </option>
//       ))}
//     </Field>
//   );
// };
// FrenchLocationField.SuccessFlat = function Loading(
//   props: FieldAttributes<{}> & {
//     query_info: QueryObserverSuccessResult<Location[]>;
//   },
// ) {
//   const {
//     query_info: { data },
//     ref,
//     ...other_props
//   } = props;
//   const { className, name, id, disabled } = other_props;
//   if (data.length === 0)
//     return (
//       <select
//         className={select({ className })}
//         disabled={true}
//         {...{ name, id }}
//       >
//         <option hidden value={""}>
//           Pas trouvé...
//         </option>
//       </select>
//     );
//   return (
//     <select className={select({ className })} {...{ name, disabled, id }}>
//       {data.map(({ nom }) => (
//         <option key={nom} value={nom}>
//           {nom}
//         </option>
//       ))}
//     </select>
//   );
// };
