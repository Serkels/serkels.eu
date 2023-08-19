//

import {
  createContext,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";

//

export type DeleteButtonStatus = {
  isDeleting: boolean;
  shouldDelete: boolean;
};

export const DeleteButtonContext = createContext<
  [DeleteButtonStatus, Dispatch<SetStateAction<DeleteButtonStatus>>]
>({} as any);

export function useDeleteButtonState() {
  return useState<DeleteButtonStatus>({
    isDeleting: false,
    shouldDelete: false,
  });
}
