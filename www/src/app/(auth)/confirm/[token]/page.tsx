//

import { BigBar, Footer } from "@1/ui/shell";
import Image from "next/image";
import { ConfirmPanel } from "./ConfirmPanel";
//

// export const metadata: Metadata = {
//   title: "Sign In _ Toc-Toc",
//   description: "Sign In",
// };

export default async function Page({ params }: { params: { token: string } }) {
  const now = await getServerDate();
  const { token } = params;

  return (
    <>
      <BigBar>
        <Image
          src="/toc-toc.svg"
          alt="Toc Toc Logo"
          width={175}
          height={53}
          priority
        />
      </BigBar>

      <ConfirmPanel token={token} />

      <Footer now={now} />
    </>
  );
}

//

async function getServerDate() {
  return new Date().toISOString();
}
