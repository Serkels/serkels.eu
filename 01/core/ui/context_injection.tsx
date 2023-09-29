//

import type { PropsWithChildren } from "react";
import type {
  constructor,
  DependencyContainer,
} from "tsyringe/dist/typings/types";
import { container as root_container } from "../di";
import { register_branch, type Registrations } from "./register";

//

const REGISTRATIONS_KEY = "registrations";
const CONTAINER_KEY = "container";

//

export function context_injection<T, Parent>(parent: constructor<Parent>) {
  return function (
    target: constructor<T> & {
      Layout: (props: PropsWithChildren<any>) => any;
    },
  ) {
    const LayoutComponent = target.Layout;

    target.Layout = async function RegisterLayout(...props: any[]) {
      const { children, params } = props[0];
      const registrationsFn = Reflect.getMetadata(
        REGISTRATIONS_KEY,
        target,
      ) as ({
        params,
      }: {
        params: Record<string, string>;
      }) => Promise<Registrations>;
      const registrations = await registrationsFn({ params });
      const parent_container =
        (Reflect.getMetadata(CONTAINER_KEY, parent) as DependencyContainer) ??
        root_container;

      const container = register_branch(registrations, parent_container);
      Reflect.defineMetadata(CONTAINER_KEY, container, target);

      return <LayoutComponent {...props}>{children}</LayoutComponent>;
    };
  };
}
