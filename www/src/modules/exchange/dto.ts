//

import type { components } from "@1/strapi-openapi/v1";

//

export type QuestionListSchema = components["schemas"]["QuestionListResponse"];
export type Question = components["schemas"]["Question"];

export interface Question_DTO extends Question {}
