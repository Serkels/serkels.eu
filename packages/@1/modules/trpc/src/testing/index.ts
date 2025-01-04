//

import type { Session } from "@1.modules/auth.next";
import { create_nextauth_header } from "@1.modules/auth.next/jwt";

//

export const NEXTAUTH_SECRET = "🔑";

export const douglas_student_session: Session = {
  expires: "2022-12-31T23:59:59.999Z",
  user: {},
  header: { NEXTAUTH_TOKEN: "🔑" },
  profile: {
    id: "douglas_profile_id",
    image: "https://picsum.photos/222/333",
    name: "Douglas",
    role: "STUDENT",
  },
};

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
