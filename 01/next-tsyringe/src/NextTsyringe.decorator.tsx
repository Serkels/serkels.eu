//

import debug, { type Debugger } from "debug";
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

export interface NextTsyringeRegister {
  register?: RegistrationFn;
}

// TODO(douglasdutiel): remove zod dependency
// one might not need zod here...
const Scope_Schema = z.union([
  z.literal("both"),
  z.literal("client-only"),
  z.literal("server-only"),
]);
type Scope = z.infer<typeof Scope_Schema>;

//

export interface LayoutModuleLike {
  register?: RegistrationFn;
  Provider: (props: PropsWithChildren<any>) => any;
  log?: Debugger;
}

export class NextTsyringe {
  static PARENT = Symbol.for("parent");
  static NAME = Symbol.for("name");
  static CONTAINER = Symbol.for("container");

  //

  static module({
    parent,
    scope = "both",
    root_container = root,
  }: {
    parent?: object;
    scope?: Scope;
    root_container?: DependencyContainerEX;
  }) {
    return function module_decorator<T>(
      target: constructor<T> & LayoutModuleLike,
    ) {
      const name = target.name ?? `NextTsyringe.Module ${target}`;
      const log = target.log ?? logger.extend(`🎍 ${name}`);
      log(`🪄 ${name}`);

      const nope_registrationsFn: RegistrationFn = () => {
        log("nothing to register");
        return Promise.resolve([] as Registration[]);
      };
      const register_fn = target.register ?? nope_registrationsFn;

      Reflect.defineMetadata(NextTsyringe.PARENT, parent, target);

      const parent_container: DependencyContainerEX =
        Reflect.getMetadata(NextTsyringe.CONTAINER, parent ?? {}) ??
        root_container;
      const container = parent_container.createNamedChildContainer(name);
      log(`⏮️💉 ${container.id} (${parent_container.id})`);

      Reflect.defineMetadata(NextTsyringe.CONTAINER, container, target);

      async function register_parent(
        module_target: object & LayoutModuleLike,
        { params }: { params: Record<string, string> },
      ) {
        const parent_module: LayoutModuleLike = Reflect.getMetadata(
          NextTsyringe.PARENT,
          module_target,
        );

        if (parent_module) {
          await register_parent(parent_module, { params });
        } else {
          return;
        }

        //

        const register_module_fn =
          module_target.register ?? nope_registrationsFn;
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
