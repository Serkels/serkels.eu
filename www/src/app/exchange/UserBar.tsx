"use client";

//

// import BinocularsIcon from "@1/ui/icons/binoculars.svg";
// import { Binoculars } from "@1/ui/icons";
import { AppBar } from "@1/ui/shell";
import { useSession } from "next-auth/react";
import Link from "next/link";

//

function Binoculars(props: any) {
  props;
  return <></>;
}
export function UserBar() {
  const { data: session } = useSession();
  session;
  // console.log({ session });
  return (
    <AppBar>
      <nav>
        <ul className="flex">
          <li>
            <Link className="flex min-w-[121px]" href="/exchange">
              <Binoculars className="w-5" />
              Échanges
            </Link>
          </li>
          <li>
            <Link className="flex min-w-[121px]" href="/exchange">
              <Binoculars className="w-5" />
              Échanges
            </Link>
          </li>
          <li>
            <Link className="flex min-w-[121px]" href="/exchange">
              <Binoculars className="w-5" />
              Échanges
            </Link>
          </li>
          <li>
            <Link className="flex min-w-[121px]" href="/exchange">
              <Binoculars className="w-5" />
              Échanges
            </Link>
          </li>
        </ul>
      </nav>
      <nav></nav>
    </AppBar>
  );
}

//
