//

import { Spinner } from "@1.ui/react/spinner";

//

export function SendingInProgress() {
  return (
    <div className="flex flex-1 flex-col justify-center">
      <h1
        className={`
        mx-auto
        my-0
        text-center
        text-xl
        font-extrabold
      `}
      >
        Envoie en cours...
      </h1>
      <div className="mx-auto mt-5 text-center">
        <Spinner />
      </div>
    </div>
  );
}
