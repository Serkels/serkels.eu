//

export interface DatedEntryProps {
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export class DatedEntryViewModel {
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
    } satisfies DatedEntryProps;
  }
}
