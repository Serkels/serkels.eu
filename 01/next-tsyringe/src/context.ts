"use client";

import { createContext, useContext } from "react";
import type { InjectionToken } from "tsyringe";
import { root_container } from "./dependency-container";

//

export const ContainerContext = createContext(root_container);

export const useContainer = () => {
  return useContext(ContainerContext);
};

export const useInject = <T extends unknown>(token: InjectionToken<T>) => {
  const container = useContainer();
  return container.resolve(token) as T;
};
