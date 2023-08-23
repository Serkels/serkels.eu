//

import type { components } from "./v1";

//

type Schemas = components["schemas"];

//

export type With_Id = { id: number };

//

export type Profile_Schema = Schemas["UserProfile"] & With_Id;
export type Notification = any & With_Id;
