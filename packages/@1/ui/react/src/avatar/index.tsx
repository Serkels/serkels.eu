//

import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
  type PropsWithChildren,
} from "react";
import { createSlot } from "react-slotify";
import { tv } from "tailwind-variants";
import { School } from "../icons";
import {
  avatar,
  avatar_media,
  type AvatarMediaVariantProps,
  type AvatarVariantProps,
} from "./atom";

//

export interface AvatarProps
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
          src={src ?? "/opengraph-image.png"}
          alt={`Avatar of the user ${id}`}
          {...other_props}
        />
      </figure>
    );
  },
);

//

export interface AvatarMediaProps
  extends AvatarProps,
    AvatarVariantProps,
    AvatarMediaVariantProps {
  image?: string;
  id?: string;
  variant?: AvatarVariantProps;
}
export function AvatarMedia(
  props: PropsWithChildren<AvatarMediaProps & { name: string }>,
) {
  const {
    children,
    className,
    id,
    image,
    name,
    tv$color,
    tv$direction,
    tv$size,
    variant,
    ...other_props
  } = props;

  const { figcaption, figure, avatar, title, subtitle } = avatar_media({
    tv$direction,
    tv$size,
    tv$color,
    ...variant,
  });

  return (
    <figure className={figure({ className })} {...other_props}>
      <Avatar className={avatar({ tv$size })} {...{ image, id }} />
      <figcaption className={figcaption()}>
        <h4 className={title()} title={name}>
          {name}
        </h4>
        <small className={subtitle()}>
          <AvatarMedia.SubTitle.Renderer
            childs={children}
          ></AvatarMedia.SubTitle.Renderer>
        </small>
      </figcaption>
    </figure>
  );
}

AvatarMedia.SubTitle = createSlot();

//

export function AvatarMediaHorizontal(
  props: AvatarProps & { name: string; university?: string },
) {
  const { className, image, id, university, name, ...other_props } = props;
  const style = tv({ base: "flex items-center space-x-7" });

  return (
    <figure className={style({ className })} {...other_props}>
      <Avatar className="size-14" {...{ image, id }} />
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
