//

import { useServerAction } from "zsa-react";
import login_action from "./login.action";

//

export function useLogin() {
  return useServerAction(login_action);
}
