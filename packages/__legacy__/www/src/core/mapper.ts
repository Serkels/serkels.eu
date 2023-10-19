//

import { Entity } from "@1/core/domain";

//

export interface Mapper<DomainEntity extends Entity<any>, PersistentRecord> {
  toPersistence(entity: DomainEntity): PersistentRecord;
  toDomain(record: any): DomainEntity;

  //
  // isDomain(record: any): record is DomainEntity;
}
