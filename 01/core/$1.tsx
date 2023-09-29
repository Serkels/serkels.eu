//

import debug from "debug";
import { type PropsWithChildren } from "react";
import type { constructor } from "tsyringe/dist/typings/types";
import { z } from "zod";
import {
  createChildContainer,
  root_container,
  type DependencyContainerEntry,
} from "./di";
import { DI_Container_Provider } from "./ui/di.context.client";
import { register_branch, type Registrations } from "./ui/register";

//

const log = debug("~:core:$1");
type RegistrationFn = ({
  params,
}: {
  params: Record<string, string>;
}) => Promise<Registrations>;

const Scope_Schema = z.union([
  z.literal("both"),
  z.literal("client-only"),
  z.literal("server-only"),
]);
type Scope = z.infer<typeof Scope_Schema>;

//

export class $1 {
  static PARENT = Symbol.for("parent");
  static REGISTRATIONS = Symbol.for("registrations");
  static CONTAINER = Symbol.for("container");

  static module({
    parent,
    registrationFn,
    scope = "both",
  }: {
    parent?: object;
    registrationFn?: RegistrationFn;
    scope?: Scope;
  }) {
    const nope_registrationsFn = () => {
      log("nothing to register");
      return [] as Registrations;
    };
    const register_fn = registrationFn ?? nope_registrationsFn;

    return function module_decorator<T>(
      target: constructor<T> & {
        Provider: (props: PropsWithChildren<any>) => any;
      },
    ) {
      log("module", target);

      Reflect.defineMetadata($1.PARENT, parent, target);
      Reflect.defineMetadata($1.REGISTRATIONS, register_fn, target);

      const parent_container: DependencyContainerEntry =
        Reflect.getMetadata($1.CONTAINER, parent ?? {}) ?? root_container;
      const container = createChildContainer(parent_container);
      Reflect.defineMetadata($1.CONTAINER, container, target);

      async function register_parent(
        module_target: object,
        { params }: { params: Record<string, string> },
      ) {
        const parent_module: RegistrationFn = Reflect.getMetadata(
          $1.PARENT,
          module_target,
        );
        if (parent_module) {
          await register_parent(parent_module, { params });
        }

        //

        const register_module_fn: RegistrationFn =
          Reflect.getMetadata($1.REGISTRATIONS, module_target) ??
          nope_registrationsFn;
        const container: DependencyContainerEntry = Reflect.getMetadata(
          $1.CONTAINER,
          module_target,
        );
        if (!container) throw new Error("O_à");

        log("⏮️💉", container.id.value());
        const registrations = await register_module_fn({ params });
        for (const { token, options, ...provider } of registrations || []) {
          log("⏺️", token, provider, options);
          container.register(token, provider as any, options);
        }
      }

      async function register_all_parents({
        params,
      }: {
        params: Record<string, string>;
      }) {
        await register_parent(target, { params });
      }

      const ProviderComponent = target.Provider;
      target.Provider = async function Provider(
        props: PropsWithChildren<{ params: Record<string, string> }>,
      ) {
        const { children, params } = props;

        await register_all_parents({ params });
        const registrations = await register_fn({ params });

        if (scope === "client-only") {
          return (
            <DI_Container_Provider registrations={registrations}>
              <ProviderComponent {...props}> {children} </ProviderComponent>
            </DI_Container_Provider>
          );
        }

        log("⏮️💉", container.id.value());
        for (const { token, options, ...provider } of registrations || []) {
          log("⏺️", token, provider, options);
          container.register(token, provider as any, options);
        }

        if (scope === "server-only") {
          return (
            <DI_Container_Provider>
              <ProviderComponent {...props}> {children} </ProviderComponent>
            </DI_Container_Provider>
          );
        }

        return (
          <DI_Container_Provider registrations={registrations}>
            <ProviderComponent {...props}> {children} </ProviderComponent>
          </DI_Container_Provider>
        );
      };
    };
  }

  static container(container = root_container) {
    return function container_decorator(target: object) {
      log("container", target, container.id.value());
      Reflect.defineMetadata($1.CONTAINER, container, target);
    };
  }

  static use_container<Parent>(
    target: constructor<Parent>,
  ): DependencyContainerEntry {
    // const parent_container: DependencyContainerEntry =
    const container = Reflect.getMetadata($1.CONTAINER, target);
    if (!container) throw new Error("Missing container on " + target);
    return container;
  }

  static server_injection(registrations: Registrations) {
    return function server_injection_decorator(target: object) {
      log("server_injection_decorator", target);
      // const parent_container: DependencyContainerEntry =
      const parent_container: DependencyContainerEntry | undefined =
        Reflect.getMetadata($1.CONTAINER, target);

      if (!parent_container) {
        throw new Error("Missing @$1.container on " + target);
      }
      const container = register_branch(registrations, parent_container);
      log("⏮️💉", container.id.value());

      Reflect.defineMetadata($1.CONTAINER, container, target);
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
        Layout: ((props: PropsWithChildren<any>) => any) | undefined;
      },
    ) {
      const LayoutComponent = target.Layout;
      if (!LayoutComponent) {
        throw new Error("A static Layout component is require");
      }

      const nope_registrationsFn = () => {
        log("nothing to register");
      };
      const registrationsFn: ({
        params,
      }: {
        params: Record<string, string>;
      }) => Promise<Registrations> =
        Reflect.getMetadata($1.REGISTRATIONS, target) ?? nope_registrationsFn;

      const parent_container: DependencyContainerEntry = Reflect.getMetadata(
        $1.CONTAINER,
        parent,
      );

      if (!parent_container) {
        throw new Error("Missing @$1.container on " + parent);
      }

      target.Layout = async function RegisterLayout(
        props: PropsWithChildren<{ params: Record<string, string> }>,
      ) {
        const { children, params } = props;

        const registrations = await registrationsFn({ params });

        const container = register_branch(registrations, parent_container);
        log("⏮️💉", container.id.value());

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
