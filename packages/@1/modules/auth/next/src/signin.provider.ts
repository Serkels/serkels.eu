//

import {
  PROFILE_ROLES,
  Partner_Schema,
  Profile_Schema,
  Studient_Schema,
} from "@1.modules/profile.domain";
import { hashToken } from "@douglasduteil/nextauth...trpc.prisma/jwt";
import Credentials_Provider from "next-auth/providers/credentials";
import { parseUrl } from "next/dist/shared/lib/router/utils/parse-url";
import { randomBytes } from "node:crypto";
import { match } from "ts-pattern";
import { z } from "zod";
import { Email } from "./email.provider";
import { trpc } from "./trpc";

//

const ONE_DAY_IN_SECONDS = 86_400;

const User_DTO = z.object({
  id: z.string().default(""),
  email: z.string().trim().toLowerCase().email(),
  name: z.string().trim(),
  role: PROFILE_ROLES,
});

export const SignIn = Credentials_Provider({
  id: "signin",
  credentials: {
    email: { label: "Email", type: "text" },
    name: { label: "Name", type: "text" },
    role: { label: "Role", type: "text" },
  },
  async authorize(credentials, req) {
    debugger;
    try {
      const headers = req.headers ?? {};
      const origin_url = parseUrl(String(headers["origin"] ?? ""));
      const url = new URL("/", origin_url.href);

      const user = await User_DTO.parseAsync(credentials, {
        path: ["credentials"],
      });

      const user_exists =
        await trpc.auth.next_auth_adapter.getUserByEmail.query(user.email);

      if (user_exists) return null;

      const {
        generateVerificationToken = () => randomBytes(32).toString("hex"),
      } = Email;
      const token = await generateVerificationToken();

      const { maxAge = ONE_DAY_IN_SECONDS } = Email.options;
      const expires = new Date(Date.now() + maxAge * 1000);
      const { callbackUrl } = z
        .object({ callbackUrl: z.string().url().default(url.href) })
        .parse(req.query, { path: ["req.query"] });
      const { email: identifier } = user;

      // Generate a link with email, unhashed token and callback url
      const { type } = Email;
      const params = new URLSearchParams({
        callbackUrl,
        token,
        email: identifier,
      });

      const _url = new URL(`/api/auth/callback/${type}?${params}`, url);

      const token_id = hashToken(token, {
        provider: Email.options,
      });

      await Promise.all([
        // Send to user
        Email.sendVerificationRequest({
          identifier,
          token,
          expires,
          url: _url.href,
          provider: Email,
          theme: {},
        }),
        // Save in database
        trpc.auth.next_auth_adapter.createVerificationToken.mutate({
          identifier,
          token: token_id,
          expires,
        }),
        //
      ]);

      await create_payload({ credentials, token });

      return user;
    } catch (error) {
      console.error(error);
      return null;
    }
  },
});

async function create_payload({
  credentials,
  token,
}: {
  credentials: any;
  token: string;
}) {
  debugger;
  const token_id = hashToken(token, {
    provider: Email.options,
  });
  const { email: identifier } = credentials;
  const { name, role } = Profile_Schema.pick({
    bio: true,
    name: true,
    role: true,
  }).parse(credentials, { path: ["credentials"] });

  const context = match(role)
    .with(PROFILE_ROLES.Enum.ADMIN, () => ({}))
    .with(PROFILE_ROLES.Enum.PARTNER, () =>
      Partner_Schema.omit({ id: true, profile: true }).parse(credentials),
    )
    .with(PROFILE_ROLES.Enum.STUDIENT, () =>
      Studient_Schema.omit({ id: true, profile: true, interest: true }).parse(
        credentials,
      ),
    )
    .exhaustive();

  console.log({ context });

  await trpc.auth.payload.link.mutate({
    identifier,
    name: name,
    role,
    context,
    token: token_id,
  });
}
