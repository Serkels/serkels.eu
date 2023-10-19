"use client";

import { create_container_provider } from "@1/next-tsyringe";
import { fromClient } from "./api/v1";
import { API_TOKEN } from "./api/v1/OpenAPI.repository";

//

export const Register_OpenAPI = create_container_provider(() => {
  return [
    {
      token: API_TOKEN,
      useValue: fromClient,
    },
  ];
}, "Register_OpenAPI");
