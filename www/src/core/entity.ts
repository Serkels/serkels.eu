//

export abstract class Entity<EntityProps> {
  constructor(
    public readonly id: string,
    protected readonly props: EntityProps,
  ) {}

  get data() {
    const { id, props } = this;
    return Object.freeze({ id, ...props });
  }
}
