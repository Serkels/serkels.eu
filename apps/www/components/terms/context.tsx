//

import { useLocalStorageValue } from "@react-hookz/web";
import { useRouter } from "next/navigation";
import { createContext, useContext, type PropsWithChildren } from "react";

//

export const term_context = createContext({
  has_signed: false,
  accept: () => {},
  decline: () => {},
});

export function useTerm() {
  return useContext(term_context);
}

export function LegalProvider({ children }: PropsWithChildren) {
  const { value: has_signed, set: set_has_signed } = useLocalStorageValue(
    "terms-accepted",
    {
      defaultValue: false,
      initializeWithValue: true,
    },
  );

  const router = useRouter();

  const accept = () => set_has_signed(true);
  const decline = () => {
    set_has_signed(false);
    router.push("/");
  };

  return (
    <term_context.Provider value={{ has_signed, accept, decline }}>
      {children}
    </term_context.Provider>
  );
}
