//

import { BasicOpenApiViewModel } from "./BasicOpenApiViewModel";

export interface DatedEntryProps {
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export class DatedEntryViewModel extends BasicOpenApiViewModel<DatedEntryProps> {
  static from_server({
    createdAt,
    updatedAt,
  }: {
    createdAt: string | undefined;
    updatedAt: string | undefined;
  }) {
    return {
      createdAt: createdAt ? new Date(createdAt) : new Date(NaN),
      updatedAt: updatedAt ? new Date(updatedAt) : new Date(NaN),
    };
  }
}
