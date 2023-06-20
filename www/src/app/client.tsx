"use client";
import type { paths } from "@1/strapi-openapi/v1";
import createClient from "openapi-fetch";

export const client = createClient<paths>({ baseUrl: "/api/v1" });
