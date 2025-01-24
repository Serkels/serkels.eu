//

import { create_nextauth_header } from "@1.modules/auth.next/jwt";

//

export const NEXTAUTH_SECRET = "🔑";

export const douglas_golden_nextauth_header = await create_nextauth_header({
  secret: "🔑",
  token: {
    profile: {
      id: "douglas_profile_id",
      image: "https://picsum.photos/222/333",
      name: "Douglas",
      role: "STUDENT",
    },
  },
});

export const vulfpeck_golden_nextauth_header = await create_nextauth_header({
  secret: "🔑",
  token: {
    profile: {
      id: "vulfpeck_profile_id",
      image: "https://picsum.photos/222/333",
      name: "Vulfpeck",
      role: "PARTNER",
    },
  },
});
