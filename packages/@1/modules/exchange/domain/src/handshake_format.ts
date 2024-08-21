//

import { match } from "ts-pattern";
import {
  HANDSHAKE_ACCEPETED,
  HANDSHAKE_COMPLETED,
  HANDSHAKE_DENIED,
} from "./index";

//

export function handshake_format(handshake: string) {
  return match(handshake)
    .with(HANDSHAKE_ACCEPETED, () => "C'est OK pour moi ✅")
    .with(HANDSHAKE_COMPLETED, () => "🎊 Félicitation !")
    .with(HANDSHAKE_DENIED, () => "✖️ Je ne suis plus disponible.")
    .otherwise((content: string) => content);
}
