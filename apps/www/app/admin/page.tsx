//

import { link } from "@1.ui/react/link/atom";
import Link from "next/link";

//

export default async function Page() {
  return (
    <ul>
      <li>
        <Link className={link()} href="/admin/categories">
          Categories
        </Link>
      </li>
    </ul>
  );
}
