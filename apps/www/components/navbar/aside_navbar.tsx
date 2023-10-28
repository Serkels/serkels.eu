//

import type { Partner, Studient } from "@1.modules/profile.domain";
import { Avatar } from "@1.modules/profile.ui";
import {
  PartnerAvatarMedia,
  StudientAvatarMedia,
} from "@1.modules/profile.ui/avatar";
import {
  Archive,
  Binoculars,
  Bookmark,
  Envelope,
  Exchange,
  Gear,
  Plus,
  PlusBox,
} from "@1.ui/react/icons";
import { tv } from "tailwind-variants";
import { Li_Link, SubNav_Bookmarks } from "./aside_navbar.client";

//

export function Studient_NavBar({ studient }: { studient: Studient }) {
  return (
    <nav className={navbar()}>
      <StudientAvatarMedia
        tv$direction="column"
        className="py-5"
        studient={studient}
      />
      <ul>
        <Li_Link icon={<PlusBox />} href="./exchanges/new">
          Créer
        </Li_Link>
        <Li_Link icon={<Archive />} href="./exchanges/mine">
          Mes annonces
        </Li_Link>
        <Li_Link icon={<Plus />} href="./exchanges/inbox">
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
          icon={<Avatar className="h-6" profile={studient.profile} />}
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

//

export function Partner_NavBar({ partner }: { partner: Partner }) {
  const { profile } = partner;
  return (
    <nav className={navbar()}>
      <PartnerAvatarMedia
        tv$direction="column"
        className="py-5"
        partner={partner}
      />
      <ul>
        <Li_Link
          icon={<Avatar className="h-6" profile={profile} />}
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
export const aside_navbar = tv({
  base: "py-5 pt-10 ",
  variants: {},
});
const navbar = tv({
  base: "sticky top-16 py-5 pt-10",
  variants: {
    $alone: {
      // true: "block max-h-[calc(100vh_-_theme(spacing.16)-_theme(spacing.8))] ",
      false: "",
    },
  },
});
