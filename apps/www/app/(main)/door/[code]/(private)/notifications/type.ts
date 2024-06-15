//

import type { RouterOutput } from "@1.infra/trpc";

export type Notification = RouterOutput["notification"]["find"]["data"][number];
