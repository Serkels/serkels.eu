"use client";

import { School } from "@1/ui/icons";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  forwardRef,
  useMemo,
  type ComponentPropsWithoutRef,
  type ElementRef,
  type ReactNode,
} from "react";
import { tv, type ClassProp, type VariantProps } from "tailwind-variants";
import { P, match } from "ts-pattern";

//

interface AvatarProps extends ComponentPropsWithoutRef<"figure"> {
  u?: string | number | undefined;
}
export const Avatar = forwardRef<ElementRef<"figure">, AvatarProps>(
  function Avatar(props, forwardedRef) {
    const { className, u, ...other_props } = props;

    const { data: session } = useSession();
    const id = u ?? session?.user?.id ?? "unknown";

    const image = useMemo(
      () => session?.user?.image ?? "/opengraph-image.png",
      [session?.user?.image],
    );

    return (
      <figure className={avatar_img({ className })} ref={forwardedRef}>
        <img src={image} alt={`Avatar of the user ${id}`} {...other_props} />
      </figure>
    );
  },
);

export function Link_Avatar(
  props: ComponentPropsWithoutRef<"img"> & { u?: string | number | undefined },
) {
  const { className, u, ...other_props } = props;

  const { data: session } = useSession();
  const id = u ?? session?.user?.id;

  const image = useMemo(
    () => session?.user?.image ?? "/opengraph-image.png",
    [session?.user?.image],
  );

  if (!id) {
    return null;
  }

  return (
    <Link href={`/@${id}`}>
      <img className={avatar_img({ className })} src={image} {...other_props} />
    </Link>
  );
}
export const avatar_img = tv({
  base: "overflow-hidden rounded-full object-cover",
});

export function AvatarMediaVertical(props: ComponentPropsWithoutRef<"figure">) {
  const { className, ...other_props } = props;
  const { data: session } = useSession();
  const university = "session.user?.profile.attributes?.university";
  const style = tv({ base: "flex flex-col items-center" });
  if (!session) return null;

  return (
    <figure className={style({ className })} {...other_props}>
      <Avatar className="h-14 w-14" />
      <figcaption>
        <h4
          className="mb-2 mt-3 text-xl font-bold text-Cerulean"
          title={session.user!.name!}
        >
          {session.user?.name}
        </h4>
        <small className="block text-center text-xs text-Dove_Gray">
          <School className="mr-1.5 inline-block w-4" />
          <span>{university}</span>
        </small>
      </figcaption>
    </figure>
  );
}

export function AvatarMediaHorizontalPrimary(
  props: ComponentPropsWithoutRef<"figure">,
) {
  const { className, ...other_props } = props;
  const { data: session } = useSession();
  const university = "session.user?.profile.attributes?.university";
  const style = tv({ base: "flex items-center space-x-7" });
  if (!session) return null;

  return (
    <figure className={style({ className })} {...other_props}>
      <Avatar className="h-14 w-14" />
      <figcaption>
        <h4
          className="text-xl font-bold text-Cerulean"
          title={session.user!.name!}
        >
          {session.user?.name}
        </h4>
        <small className="block text-sm text-Dove_Gray">
          <School className="mr-1.5 inline-block w-6" />
          <span>{university}</span>
        </small>
      </figcaption>
    </figure>
  );
}

export function AvatarMediaHorizontal(
  props: ComponentPropsWithoutRef<"figure"> & {
    u?: string | number | undefined;
    username?: string | undefined;
    university?: string | undefined;
  },
) {
  const { className, u, username, university, ...other_props } = props;
  const style = tv({ base: "flex" });

  return (
    <figure className={style({ className })} {...other_props}>
      <Link_Avatar className="h-12 w-12" u={u} />
      <figcaption className="ml-2 mt-0.5">
        <span className="block text-base font-medium leading-snug text-black">
          {username}
        </span>
        <span className="block text-sm font-light leading-snug text-gray-500 ">
          🎓 {university}
        </span>
      </figcaption>
    </figure>
  );
}

const avatar_media = tv({
  slots: {
    figure: "flex",
    avatar: "h-12 w-12",
    figcaption: "ml-2 mt-0.5",
    title: "block text-left text-base font-medium leading-snug text-black",
    subtitle: "block text-sm font-light leading-snug text-gray-500",
  },
  variants: {
    $size: {
      sm: {
        avatar: "h-9 w-9",
      },
    },
    $linked: { true: {}, false: {} },
  },
});

export function AvatarMedia(
  props: ComponentPropsWithoutRef<"figure"> &
    VariantProps<typeof avatar_media> & {
      u?: string | number | undefined;
      username?: string | undefined;
      university?: string | undefined;
      sub_name?: (
        tvStyle: (props: ClassProp) => string,
      ) => ReactNode | undefined;
    },
) {
  const {
    className,
    u,
    username,
    university,
    $size,
    $linked,
    sub_name,
    ...other_props
  } = props;
  const { figure, avatar, figcaption, title, subtitle } = avatar_media({
    $size,
    $linked,
  });
  return (
    <figure className={figure({ className })} {...other_props}>
      {$linked ?? true ? (
        <Link_Avatar className={avatar()} u={u} />
      ) : (
        <Avatar className={avatar()} u={u} />
      )}
      <figcaption className={figcaption()}>
        <span className={title()}>{username}</span>

        {match({ sub_name, university })
          .with({ sub_name: P.nullish, university }, () => (
            <span className={subtitle()}>🎓 {university}</span>
          ))
          .with({ sub_name: P.not(P.nullish).select() }, (sub_name_fn) => (
            <span className={subtitle()}>{sub_name_fn(subtitle)}</span>
          ))
          .otherwise(() => null)}
      </figcaption>
    </figure>
  );
}
