import type { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Strapi Passwordless",
      credentials: {
        token: { label: "Token", type: "text" },
      },

      async authorize(credentials) {
        if (credentials == null) return null;
        try {
          const response = await fetch(
            process.env["STRAPI_API_URL"] +
              "/api/passwordless/login?loginToken=" +
              credentials.token,
            {
              headers: {
                "Content-type": "application/json; charset=UTF-8",
              },
            }
          );

          if (!response.ok) {
            throw await response.json();
          }

          return await response.json();
        } catch (error) {
          console.error(error);
          throw new Error("Failed to authorize");
        }
      },
    }),
  ],
  // pages: { error: "/" },
  callbacks: {
    async session({ session, token }) {
      console.log("session");
      console.log({ session, token });
      // session.id = token.id;
      // session.jwt = token.jwt;
      // session.user.username = token.username;
      // session.user.username = token.username;
      session.user = {
        email: token.email!,
        image: "https://i.pravatar.cc/256?u=" + token.email,
        name: token.name || (token as any).username,
      };
      return Promise.resolve(session);
    },

    async jwt({ token, user }) {
      console.log("jwt");
      console.log({ token, user });
      if (user) {
        const strapiUser = user as any as {
          jwt: string;
          user: { id: number; username: string; email: string };
        };
        token["id"] = strapiUser.user.id;
        token["jwt"] = strapiUser.jwt;
        token.name = strapiUser.user.username;
        token.email = strapiUser.user.email;
        token.picture = "https://source.unsplash.com/random/64x64";
      }
      //     name?: string | null
      // email?: string | null
      // picture?: string | null
      // sub?: string
      return Promise.resolve(token);
    },
  },
};
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
