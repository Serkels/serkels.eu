//

import type { Entity } from "./entity";

//

export interface Mapper<DomainEntity extends Entity<any>, PersistentRecord> {
  toPersistence(entity: DomainEntity): PersistentRecord;
  toDomain(record: PersistentRecord): DomainEntity;
}
