//

import {
  HANDSHAKE_ACCEPETED,
  HANDSHAKE_COMPLETED,
  HANDSHAKE_DENIED,
} from "@1.modules/exchange.domain";
import { match } from "ts-pattern";

//

export function handshake_format(handshake: string) {
  return match(handshake)
    .with(HANDSHAKE_ACCEPETED, () => "C'est OK pour moi ✅")
    .with(HANDSHAKE_COMPLETED, () => "🎊 Félicitation !")
    .with(HANDSHAKE_DENIED, () => "✖️ Je ne suis plus interessé.")
    .otherwise((content: string) => content);
}
