//

import type { _1_HOUR_ } from "./index";

// @ts-expect-error
const _wrong_number_ = 1234 satisfies _1_HOUR_;

const _1_HOURS_ = 3600 satisfies _1_HOUR_;
