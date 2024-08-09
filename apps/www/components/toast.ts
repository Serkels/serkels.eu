//

import { type ToastOptions, Slide } from "react-toastify";

//

export const AppToastOptions: ToastOptions = {
  autoClose: 5000,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "light",
  transition: Slide,
};
