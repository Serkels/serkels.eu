//

import { tv } from "tailwind-variants";

//

export const input = tv({
  base: `
  w-full
  rounded-sm
  border
  border-solid
  border-Silver_Chalice
  px-4 py-3
  placeholder-black
  disabled:pointer-events-none
  disabled:opacity-50
  `,
});

export const fieldset = tv({
  base: `
  flex
  items-center
  justify-around
  rounded-md
  border
  border-Silver_Chalice
  bg-white
  py-2
  disabled:pointer-events-none
  disabled:opacity-50
  [&>label]:flex
  [&>label]:items-center
  [&>label]:space-x-3
  `,
});

/*

export function InputField(props: FieldAttributes<{}>) {
  const { className, ...other_props } = props;
  return (
    <Field
      className={clsx(
        `
        w-full
        rounded-sm
        border
        border-solid
        border-Silver_Chalice
        px-4 py-3
        placeholder-black
        disabled:pointer-events-none
        disabled:opacity-50
        `,
        className,
      )}
      {...other_props}
    ></Field>
  );
}
export function Fieldset(props: ComponentPropsWithoutRef<"fieldset">) {
  const { className, ...other_props } = props;
  return (
    <fieldset
      className={clsx(
        `
        flex
        items-center
        justify-around
        rounded-md
        border
        border-Silver_Chalice
        bg-white
        py-2
        disabled:pointer-events-none
        disabled:opacity-50
        [&>label]:flex
        [&>label]:items-center
        [&>label]:space-x-3
        `,
        className,
      )}
      {...other_props}
    ></fieldset>
  );
}
*/
