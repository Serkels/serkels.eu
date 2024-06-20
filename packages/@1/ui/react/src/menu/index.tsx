//

import type { PropsWithChildren } from "react";
import {
  Menu as AriaMenu,
  MenuItem,
  MenuTrigger,
  Popover,
  type MenuProps as AriaMenuProps,
  type MenuItemProps,
} from "react-aria-components";
import { type VariantProps } from "tailwind-variants";
import { Button } from "../button";
import { item, menu } from "./atom";

//

type MenuVariantProps = VariantProps<typeof menu>;

export interface MenuProps extends PropsWithChildren<AriaMenuProps<{}>> {
  variant?: MenuVariantProps;
}

//

export function Menu({ className, children, variant, ...props }: MenuProps) {
  return (
    <MenuTrigger {...props}>
      <Button aria-label="Menu" variant={{ intent: "light", state: "ghost" }}>
        •••
      </Button>
      <Popover className={menu({ className })}>
        <AriaMenu className="outline-none">{children}</AriaMenu>
      </Popover>
    </MenuTrigger>
  );
}

export function ActionItem({ className, ...props }: MenuItemProps) {
  return (
    <MenuItem
      {...props}
      className={item({
        className: className instanceof String ? String(className) : "",
      })}
    />
  );
}
