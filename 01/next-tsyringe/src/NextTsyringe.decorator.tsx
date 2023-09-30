//

import debug from "debug";
import type { PropsWithChildren } from "react";
import type { constructor } from "tsyringe/types";
import { z } from "zod";
import { Container_Provider } from "./Container_Provider";
import {
  root_container as root,
  type DependencyContainerEX,
  type Registration,
} from "./dependency-container";

//

const logger = debug("~:core:NextTsyringe");

//
export type RegistrationFn = ({
  params,
}: {
  params: Record<string, string>;
}) => Promise<Registration[]>;

// TODO(douglasdutiel): remove zod dependency
// one might not need zod here...
const Scope_Schema = z.union([
  z.literal("both"),
  z.literal("client-only"),
  z.literal("server-only"),
]);
type Scope = z.infer<typeof Scope_Schema>;

//

export class NextTsyringe {
  static PARENT = Symbol.for("parent");
  static REGISTRATIONS = Symbol.for("registrations");
  static CONTAINER = Symbol.for("container");

  //

  static module({
    parent,
    registrationFn,
    scope = "both",
    root_container = root,
  }: {
    parent?: object;
    registrationFn?: RegistrationFn;
    scope?: Scope;
    root_container?: DependencyContainerEX;
  }) {
    return function module_decorator<T>(
      target: constructor<T> & {
        Provider: (props: PropsWithChildren<any>) => any;
      },
    ) {
      const name = target.name ?? "NextTsyringe.Module";
      const log = logger.extend(`🎍 ${name}`);
      log(target);

      const nope_registrationsFn = () => {
        log("nothing to register");
        return [] as Registration[];
      };
      const register_fn = registrationFn ?? nope_registrationsFn;

      Reflect.defineMetadata(NextTsyringe.PARENT, parent, target);
      Reflect.defineMetadata(NextTsyringe.REGISTRATIONS, register_fn, target);

      const parent_container: DependencyContainerEX =
        Reflect.getMetadata(NextTsyringe.CONTAINER, parent ?? {}) ??
        root_container;
      const container = parent_container.createNamedChildContainer(name);
      Reflect.defineMetadata(NextTsyringe.CONTAINER, container, target);

      async function register_parent(
        module_target: object,
        { params }: { params: Record<string, string> },
      ) {
        const parent_module: RegistrationFn = Reflect.getMetadata(
          NextTsyringe.PARENT,
          module_target,
        );

        if (parent_module) {
          await register_parent(parent_module, { params });
        } else {
          return;
        }

        //

        const register_module_fn: RegistrationFn =
          Reflect.getMetadata(NextTsyringe.REGISTRATIONS, module_target) ??
          nope_registrationsFn;
        const container: DependencyContainerEX = Reflect.getMetadata(
          NextTsyringe.CONTAINER,
          module_target,
        );
        if (!container) throw new Error("O_à");

        log("⏮️💉", container.id);
        const registrations = await register_module_fn({ params });
        for (const { token, options, ...provider } of registrations || []) {
          log("👪⏺️", token, provider, options);
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
            <Container_Provider name={name} registrations={registrations}>
              <ProviderComponent {...props}> {children} </ProviderComponent>
            </Container_Provider>
          );
        }

        log("💉", container.id);
        for (const { token, options, ...provider } of registrations || []) {
          log("🫙⏺️", token, provider, options);
          container.register(token, provider as any, options);
        }

        if (scope === "server-only") {
          return (
            <Container_Provider name={name}>
              <ProviderComponent {...props}> {children} </ProviderComponent>
            </Container_Provider>
          );
        }

        return (
          <Container_Provider name={name} registrations={registrations}>
            <ProviderComponent {...props}> {children} </ProviderComponent>
          </Container_Provider>
        );
      };
    };
  }

  static injector(target: object): DependencyContainerEX {
    const container = Reflect.getMetadata(NextTsyringe.CONTAINER, target);
    if (!container) throw new Error(`${target} injector not found`);
    return container;
  }
}

export function DefaultProvider({ children }: PropsWithChildren) {
  return <>{children}</>;
}
