"use client";

import { Button } from "@1/ui/components/ButtonV";
import tw from "tailwind-styled-components";

//

export function SendActionGroup() {
  return (
    <UI.Group>
      <Button intent="warning" size="lg">
        Plus dispo
      </Button>
      <Button size="lg">Accepter</Button>
    </UI.Group>
  );
}

//

const Group = tw.div`
  space-x-5
  text-sm
`;

//

const UI = { Group };
