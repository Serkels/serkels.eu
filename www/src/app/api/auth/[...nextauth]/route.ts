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

  return {
    id: Number(data.user.id),
    email: String(data.user.email),
    username: String(data.user.username),
    jwt: data.jwt,
  } satisfies Omit<User, "profile">;
}

async function user_profile(token: string) {
  const response = await fetch(
    `${process.env["STRAPI_API_URL"]}/api/user-profiles/me`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-type": "application/json; charset=UTF-8",
      },
    },
  );

  if (!response.ok) {
    const error: components["schemas"]["Error"] = await response.json();
    throw new Error(error.error.message);
  }

  const data: components["schemas"]["UserProfile"] = await response.json();
  return data;
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
        const profile = await user_profile(user.jwt).catch(
          () => ({}) as components["schemas"]["UserProfile"],
        );

        return {
          ...user,
          profile,
          name: [profile.firstname, profile.lastname].join(""),
        } satisfies User;
      },
    }),
  ],
  callbacks: {
    async jwt({ user, token }) {
      // console.log("jwt", { session, user, account, profile, trigger, token });

      if (user) {
        token.user = user;
      }

      return token;
    },
    async session({ session, token }) {
      // console.log("session", { user, session, newSession, token });

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
