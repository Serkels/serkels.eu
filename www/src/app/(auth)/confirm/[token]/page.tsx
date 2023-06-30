//

import { ConfirmPanel } from "./ConfirmPanel";
//

// export const metadata: Metadata = {
//   title: "Sign In _ Toc-Toc",
//   description: "Sign In",
// };

export default async function Page({ params }: { params: { token: string } }) {
  const { token } = params;

  return (
    <div className="col-span-full">
      <ConfirmPanel token={token} />
    </div>
  );
}

//
