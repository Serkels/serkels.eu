//

import { Share } from "@1.ui/react/icons";
import { ResponseButtons } from "./ResponseButtons";
import { ResponseCount } from "./ResponseCount";
//

export function Footer() {
  return (
    <footer className="mt-4">
      <div className="flex justify-between">
        <ResponseCount />
        <ResponseButtons />
        <Share className="h-5 w-5" />
      </div>
    </footer>
  );
}
