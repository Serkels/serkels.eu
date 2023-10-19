//

import { v4 } from "uuid";
import { z } from "zod";

//

export type CommandProps<T> = Omit<T, "id" | "metadata"> & Partial<Command>;

const schema = z.object({}).required();

//

export class Command {
  readonly id: string;

  // readonly metadata: CommandMetadata;

  constructor(props: CommandProps<unknown>) {
    schema.parse(props);

    // const ctx = RequestContextService.getContext();
    this.id = props.id || v4();
    // this.metadata = {
    //   correlationId: props?.metadata?.correlationId || ctx.requestId,
    //   causationId: props?.metadata?.causationId,
    //   timestamp: props?.metadata?.timestamp || Date.now(),
    //   userId: props?.metadata?.userId,
    // };
  }
}
