//

import type { PropsWithChildren } from "react";
import type {
  constructor,
  DependencyContainer,
} from "tsyringe/dist/typings/types";
import { container as root_container } from "./di";
import { DI_Container_Provider } from "./ui/di.context.client";
import { register, type Registrations } from "./ui/register";

//

export class $1 {
  static REGISTRATIONS = Symbol.for("registrations");
  static CONTAINER = Symbol.for("container");

  static registrations(
    registrationsFn: ({
      params,
    }: {
      params: Record<string, string>;
    }) => Promise<Registrations>,
  ) {
    console.log("LOL");
    return function registrations_decorator(target: object) {
      Reflect.defineMetadata($1.REGISTRATIONS, registrationsFn, target);
    };
  }

  /**
   *
   * @example
   * ```
   * const {by_id} = new User_useQuery(new StrapiRepository(fromClient, ""));
   * cosnt {info, data: user} = by_id.useQuery(0);
   *
   *
   * ```
   * @example
   *
   * ```
   * @$1.registrations(
   *   async ({ params }: { params: Record<string, string> }) => {
   *     const seesion = await Promise.resolve("doudu");
   *
   *     return [
   *       {
   *         token: JWT_TOKEN,
   *         useValue: seesion,
   *       },
   *     ];
   *   },
   * )
   * @$1.context_injection(Root_Module)
   * class Layout_Module {
   *   static async Layout({ children }: PropsWithChildren) {
   *     return <>{children}</>;
   *   }
   * }
   * ```
   */
  static context_injection<T, Parent>(parent: constructor<Parent>) {
    return function (
      target: constructor<T> & {
        Layout: (props: PropsWithChildren<any>) => any;
      },
    ) {
      const LayoutComponent = target.Layout;

      target.Layout = async function RegisterLayout(...props: any[]) {
        const { children, params } = props[0];
        const registrationsFn = Reflect.getMetadata(
          $1.REGISTRATIONS,
          target,
        ) as ({
          params,
        }: {
          params: Record<string, string>;
        }) => Promise<Registrations>;
        const registrations = await registrationsFn({ params });
        const parent_container =
          (Reflect.getMetadata($1.CONTAINER, parent) as DependencyContainer) ??
          root_container;

        const container = register(registrations, parent_container);
        Reflect.defineMetadata($1.CONTAINER, container, target);

        return (
          <DI_Container_Provider registrations={registrations}>
            <LayoutComponent {...props}> {children} </LayoutComponent>
          </DI_Container_Provider>
        );
      };
    };
  }
}
