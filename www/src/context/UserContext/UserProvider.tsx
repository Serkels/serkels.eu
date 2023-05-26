//

import type { User } from "@/api/types";
import { createContext } from "react";

//

export const UserContext = createContext<User | null>(null);
