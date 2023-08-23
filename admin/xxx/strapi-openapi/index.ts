//

import type { components } from "./v1";

//

type Schemas = components["schemas"];

//

export type With_Id = { id: number };

//

export type Exchange_ListSchema = Schemas["ExchangeListResponse"];
export type Exchange_ItemSchema = Schemas["ExchangeResponseDataObject"];
export type Exchange_Schema = Schemas["Exchange"];
export type Exchange_RequestSchema = Schemas["ExchangeRequest"];
export type New_Answer_Schema = any & With_Id;
export type Notification_Schema = any & With_Id;
export type Profile_Schema = Schemas["UserProfile"] & With_Id;
export type Question_ListSchema = components["schemas"]["QuestionListResponse"];
export type Question_Schema = components["schemas"]["Question"];

//
