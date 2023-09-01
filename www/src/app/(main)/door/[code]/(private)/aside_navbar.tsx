//

import {
  Archive,
  Binoculars,
  Bookmark,
  Envelope,
  Exchange,
  Gear,
  Plus,
  PlusBox,
} from "@1/ui/icons";
import { Avatar } from "~/components/Avatar";
import { AsideBar } from "~/components/layouts/holy/aside";
import { Header, Li_Link, SubNav_Bookmarks } from "./aside_navbar.client";

//

export function Studient_NavBar() {
  return (
    <AsideBar className="z-40 py-5 shadow-[20px_0px_40px_#00000014]">
      <Header className="py-5" />
      <Nav />
    </AsideBar>
  );
}

function Nav() {
  return (
    <nav>
      <ul>
        <Li_Link icon={<PlusBox />} href="./new/exchange">
          Créer
        </Li_Link>
        <Li_Link icon={<Archive />} href="./owned/exchanges">
          Mes annonces
        </Li_Link>
        <Li_Link icon={<Plus />} href="./my/exchanges">
          Mes échanges
        </Li_Link>
        <Li_Link icon={<Bookmark />} href="./bookmarks">
          Sauvgardes
        </Li_Link>
        <SubNav_Bookmarks href="./bookmarks">
          <Li_Link
            icon={<Exchange className="h-5 w-5" />}
            href="./bookmarks/exchanges"
          >
            Échanges
          </Li_Link>
          <Li_Link
            icon={<Binoculars className="h-5 w-5" />}
            href="./bookmarks/opportunities"
          >
            Opportunités
          </Li_Link>
        </SubNav_Bookmarks>
        <Li_Link icon={<Envelope />} href="./inbox">
          Messagerie
        </Li_Link>
        <Li_Link
          icon={<Avatar className="h-6" />}
          href="./"
          is_active_includes={["./history", "./exchanges"]}
        >
          Profil
        </Li_Link>
        <Li_Link icon={<Gear />} href="./parameters">
          Paramètres
        </Li_Link>
      </ul>
    </nav>
  );
}
