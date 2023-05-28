//

// import {  } from "module";
// import Credentials from "next-auth/src/providers/credentials";

// export  default function StrapiPasswordless(){
//   return { providers: [Credentials({
//   name: "Strapi Passwordless",

//   credentials: {
//     email: { label: "Email", type: "text", placeholder: "test@test.com" },
//   },

//   async authorize(credentials) {
//     try {
//       const res = await fetch(
//         "http://localhost:1337/api/passwordless/send-link",
//         {
//           method: "POST",
//           body: JSON.stringify({
//             email: credentials?.email,
//           }),
//           headers: {
//             "Content-type": "application/json; charset=UTF-8",
//           },
//         }
//       );
//       const data = await res.json();
//       if (data) {
//         return data;
//       } else {
//         return null;
//       }
//     } catch (e) {
//       console.error("caught error");
//       console.error(e);
//       // const errorMessage = e.response.data.message
//       // Redirecting to the login page with error message          in the URL
//       // throw new Error(errorMessage + '&email=' + credentials.email)
//       return null;
//     }
//   },
// ]

//   session: {
//     jwt: true,
//   },
// }
// });
/*
export default function StrapiPasswordless(
  options: EmailUserConfig
): EmailConfig {
  return {
    id: "strapipasswordless",
    type: "email",
    name: "Strapi Passwordless",

    session: {
      strategy: "jwt"
  },
    profile(profile) {
      return {
        id: profile.sub,
        name: profile.battle_tag,
        email: null,
        image: null,
      }
    },
  };
}
*/
