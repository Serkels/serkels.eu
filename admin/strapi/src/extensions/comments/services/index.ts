//

import {
  Comment,
  RelatedEntity,
} from "strapi-plugin-comments/types/contentTypes";
import {
  OnlyStrings,
  PopulateClause,
  StrapiPaginatedResponse,
  StrapiPagination,
  StrapiRequestQueryFieldsClause,
  StringMap,
  WhereClause,
} from "strapi-typed";

//

// ! HACK(douglasduteil): reexport the service interface

export type FindAllFlatProps<T, TFields = keyof T> = {
  query: {
    threadOf?: number | string | null;
    [key: string]: any;
  } & {};
  populate?: PopulateClause<OnlyStrings<TFields>>;
  sort?: StringMap<unknown>;
  fields?: StrapiRequestQueryFieldsClause<OnlyStrings<TFields>>;
  pagination?: StrapiPagination;
  isAdmin?: boolean;
};

export const Common_Service = {
  get findRelatedEntitiesFor() {
    // \from https://github.com/VirtusLab-Open-Source/strapi-plugin-comments/blob/70a716598a1833af0393b56c75d9190f0917c50d/types/services.d.ts#L95 //
    return strapi.plugin("comments").service("common")
      .findRelatedEntitiesFor as (
      entities: Array<Comment>,
    ) => Promise<RelatedEntity[]>;
  },
  get findOne() {
    const common = strapi.plugin("comments").service("common");
    // \from https://github.com/VirtusLab-Open-Source/strapi-plugin-comments/blob/70a716598a1833af0393b56c75d9190f0917c50d/types/services.d.ts#L89 //
    return common.findOne.bind(common) as (
      criteria: WhereClause<keyof Comment>,
    ) => Promise<Comment>;
  },
  get findAllFlat() {
    const common = strapi.plugin("comments").service("common");
    // \from https://github.com/VirtusLab-Open-Source/strapi-plugin-comments/blob/70a716598a1833af0393b56c75d9190f0917c50d/types/services.d.ts#L81 //
    return common.findAllFlat.bind(common) as (
      props: FindAllFlatProps<Comment>,
      relatedEntity?: RelatedEntity | null | boolean,
    ) => Promise<StrapiPaginatedResponse<Comment>>;
  },
};
