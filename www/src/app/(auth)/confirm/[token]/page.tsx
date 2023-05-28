//

import { ConfirmButton } from "./ConfirmButton";
//

// export const metadata: Metadata = {
//   title: "Sign In _ Toc-Toc",
//   description: "Sign In",
// };

export default async function Page({ params }: { params: { token: string } }) {
  const { token } = params;

  return (
    <>
      Confirm <ConfirmButton token={token} />
    </>
  );
}

//
