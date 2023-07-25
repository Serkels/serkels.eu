import { fromServer } from "@/app/api/v1";
import type { components } from "@1/strapi-openapi/v1";
import type { NextAuthOptions, User } from "next-auth";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";

async function passwordless_login(token: string) {
  const response = await fetch(
    `${process.env["STRAPI_API_URL"]}/api/passwordless/login?loginToken=${token}`,
    {
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    },
  );

  if (!response.ok) {
    const error: components["schemas"]["Error"] = await response.json();
    throw new Error(error.error.message);
  }

  const data: components["schemas"]["Passwordless-User"] =
    await response.json();

  if (!data.user) return null;
  if (!data.jwt) return null;
  if (data.context && data.context["email"]) {
    await update_user_profile(data.jwt, data.context);
  }

  return {
    id: Number(data.user.id),
    email: String(data.user.email),
    username: String(data.user.username),
    jwt: data.jwt,
  } satisfies Omit<User, "profile">;
}

async function update_user_profile(
  token: string,
  context: Record<string, unknown>,
) {
  const response = await fetch(
    `${process.env["STRAPI_API_URL"]}/api/user-profiles/me`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify({ data: context }),
    },
  );

  if (!response.ok) {
    const error: components["schemas"]["Error"] = await response.json();
    throw new Error(error.error.message);
  }

  const data: components["schemas"]["UserProfile"] = await response.json();
  return data;
}

async function user_profile(token: string) {
  const headers = new Headers({ Authorization: `Bearer ${token}` });
  const {
    response,
    data: body,
    error: errorBody,
  } = await fromServer.GET("/user-profiles/me", { headers });

  if (errorBody) {
    throw new Error(errorBody.error.message);
  }

  if (!body.data) {
    throw new Error(["Profile Not Found", "from " + response.url].join("\n"));
  }

  return body.data;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Strapi Passwordless",
      credentials: {
        token: { label: "Token", type: "text" },
      },

      async authorize(credentials) {
        if (!credentials) return null;
        const user = await passwordless_login(credentials.token);

        if (!user) return null;
        const profile = await user_profile(user.jwt);

        return {
          ...user,
          profile,
          name: [
            profile?.attributes?.firstname,
            profile?.attributes?.lastname,
          ].join(" "),
        } satisfies User;
      },
    }),
  ],
  callbacks: {
    async jwt({ user, token, trigger }) {
      if (trigger === "update" && token.user) {
        const profile = await user_profile(token.user.jwt);
        token.user.profile = profile;
        token.user.name = [
          profile.attributes?.firstname,
          profile.attributes?.lastname,
        ].join(" ");
      }

      if (user) {
        token.user = user;
      }

      return token;
    },
    async session({ session, token }) {
      if (token.user) {
        session.user = token.user;
      }

      return session;
    },
  },
};

//

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
