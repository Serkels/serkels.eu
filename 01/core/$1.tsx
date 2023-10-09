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
import { type Registration } from "./ui/register";

//

const log = debug("~:core:$1");
type RegistrationFn = ({
  params,
}: {
  params: Record<string, string>;
}) => Promise<Registration[]>;

const Scope_Schema = z.union([
  z.literal("both"),
  z.literal("client-only"),
  z.literal("server-only"),
]);
type Scope = z.infer<typeof Scope_Schema>;

//

/**
 * @deprecated or to rename... to NextTsyringe ?
 */
export class $1 {
  static PARENT = Symbol.for("parent");
  static REGISTRATIONS = Symbol.for("registrations");
  static CONTAINER = Symbol.for("container");

  //

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
      return [] as Registration[];
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

  static use_container<Parent>(
    target: constructor<Parent>,
  ): DependencyContainerEntry {
    // const parent_container: DependencyContainerEntry =
    const container = Reflect.getMetadata($1.CONTAINER, target);
    if (!container) throw new Error("Missing container on " + target);
    return container;
  }
}
