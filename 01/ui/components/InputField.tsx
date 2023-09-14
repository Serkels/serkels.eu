//

import { Field, type FieldAttributes } from "formik";
import { tv, type VariantProps } from "tailwind-variants";

//

const input = tv({
  base: [
    "rounded-sm border border-solid border-Silver_Chalice px-4 py-3 placeholder-black",
  ],
});

export function InputField(props: FieldAttributes<VariantProps<typeof input>>) {
  const { className, ...other_props } = props;
  return <Field {...other_props} className={input({ className })} />;
}
