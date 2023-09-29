"use client";
import { ContainerContext } from "@1/core/ui/di.context.client";
import { useContext } from "react";
import { API_TOKEN, JWT_TOKEN } from "~/app/api/v1/OpenAPI.repository";
import { Exchange_Repository } from "~/modules/exchange/Exchange_Repository";

export function registry() {
  const container = useContext(ContainerContext).createChildContainer();
  container.registerInstance(Exchange_Repository.EXCHANGE_ID_TOKEN, 987);
  container.registerInstance(API_TOKEN, {} as any);
  container.registerInstance(JWT_TOKEN, "");
  return container;
}
