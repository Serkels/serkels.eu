//

export interface Mapper<T_DTO, T_Domain> {
  toDomain(raw: T_DTO): T_Domain;
  // toDTO(domain: T_Domain): T_DTO;
  // public toPersistence (t: T) : any;
  // public static toDTO (t: T): DTO;
}
