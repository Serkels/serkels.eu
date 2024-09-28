//

export { auth as default } from "@1.modules/auth.next/edge";

// Use only one of the two middleware options below
// // 1. Use middleware directly
// export const { auth: middleware } =

// // 2. Wrapped middleware option
// const { auth } = NextAuth(authConfig);
// export default auth(async function middleware(req) {
//   // Your custom middleware logic goes here
// });
