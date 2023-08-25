//

import type { components } from "./v1";

//

type Schemas = components["schemas"];

//

export type With_Id = { id: number };

//

export type Exchange_ListSchema = Schemas["ExchangeListResponse"];
export type Exchange_ItemSchema = Schemas["ExchangeResponseDataObject"];
export type Category_ItemSchema =
  Schemas["OpportunityCategoryResponseDataObject"];
export type Exchange_Schema = Schemas["Exchange"];
export type Exchange_RequestSchema = Schemas["ExchangeRequest"];
export type Exchange_DiscussionListSchema = {
  data?: Exchange_DiscussionSchema[];
} & Common_PaginationMeta_Schema;
export type Exchange_DiscussionSchema = {
  attributes?: {
    createdAt?: string;
    updatedAt?: string;
    profile?: {
      data?: Profile_Schema;
    };
  };
  id?: number;
};
export type New_Answer_Schema = any & With_Id;
export type Notification_Schema = any & With_Id;
export type Profile_Schema = Schemas["UserProfileResponseDataObject"];
export type Question_ListSchema = Schemas["QuestionListResponse"];
export type Question_Schema = Schemas["Question"];
export type Common_PaginationMeta_Schema = {
  meta?: {
    pagination?: {
      page?: number;
      pageCount?: number;
      pageSize?: number;
      total?: number;
    };
  };
};

//
