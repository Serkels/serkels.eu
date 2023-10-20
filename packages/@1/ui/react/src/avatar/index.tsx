//

import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
} from "react";
import { tv } from "tailwind-variants";
import { School } from "../icons";
import { avatar, type AvatarVariantProps } from "./atom";

//

interface AvatarProps
  extends ComponentPropsWithoutRef<"figure">,
    AvatarVariantProps {
  image?: string;
  id?: string;
}

export const Avatar = forwardRef<ElementRef<"figure">, AvatarProps>(
  function Avatar(props, forwardedRef) {
    const { className, image: src, id, ...other_props } = props;
    const { base, image } = avatar();

    return (
      <figure className={base({ className })} ref={forwardedRef}>
        <img
          className={image()}
          src={src}
          alt={`Avatar of the user ${id}`}
          {...other_props}
        />
      </figure>
    );
  },
);

export function AvatarMediaHorizontal(
  props: AvatarProps & { name: string; university?: string },
) {
  const { className, university, name, ...other_props } = props;
  const style = tv({ base: "flex items-center space-x-7" });

  return (
    <figure className={style({ className })} {...other_props}>
      <Avatar className="h-14 w-14" />
      <figcaption>
        <h4 className="text-xl font-bold text-Cerulean" title={name}>
          {name}
        </h4>
        <small className="block text-sm text-Dove_Gray">
          <School className="mr-1.5 inline-block w-6" />
          <span>{university}</span>
        </small>
      </figcaption>
    </figure>
  );
}
