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
  Exit,
  Gear,
  PlusBox,
} from "@1.ui/react/icons";
import { tv } from "tailwind-variants";
import { SubNav_Bookmarks } from "./SubNav_Bookmarks";
import { Li_Link } from "./aside_navbar.client";
import { NewMessage_Indicator } from "./notification_indicator.client";

//

export function Studient_NavBar({ student }: { student: Studient }) {
  return (
    <nav className={navbar()}>
      <StudientAvatarMedia
        tv$direction="column"
        className="py-5"
        student={student}
      />
      <ul>
        <Li_Link icon={<PlusBox />} href="./exchanges/new">
          Créer
        </Li_Link>
        <Li_Link icon={<Archive />} href="./exchanges/mine">
          Mes publications
        </Li_Link>
        <Li_Link icon={<Exchange />} href="./exchanges/inbox">
          Les échanges
        </Li_Link>
        <Li_Link icon={<Bookmark />} href="./bookmarks">
          Sauvegardes
        </Li_Link>
        <SubNav_Bookmarks href="./bookmarks">
          <Li_Link
            icon={<Exchange className="size-5" />}
            href="./bookmarks/exchanges"
          >
            Échanges
          </Li_Link>
          <Li_Link
            icon={<Binoculars className="size-5" />}
            href="./bookmarks/opportunities"
          >
            Opportunités
          </Li_Link>
        </SubNav_Bookmarks>
        <Li_Link icon={<Envelope />} href="./inbox">
          Messagerie <NewMessage_Indicator />
        </Li_Link>
        <Li_Link
          icon={<Avatar className="h-6" profile={student.profile} />}
          href="./"
          is_active_includes={["./history", "./exchanges"]}
        >
          Profil
        </Li_Link>
        <Li_Link icon={<Gear />} href="./parameters">
          Paramètres
        </Li_Link>
        <Li_Link icon={<Exit />} href="/logout">
          Me déconnecter
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
        <Li_Link icon={<PlusBox />} href="./opportunities/new">
          Créer une opportunité
        </Li_Link>
        <Li_Link icon={<Archive />} href="./opportunities/mine">
          Mes publications
        </Li_Link>
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
        <Li_Link icon={<Exit />} href="/logout">
          Me déconnecter
        </Li_Link>
      </ul>
    </nav>
  );
}
export const aside_navbar = tv({
  base: "py-5 pt-10",
  variants: {},
});
const navbar = tv({
  base: "sticky top-0 py-5",
  variants: {
    $alone: {
      // true: "block max-h-[calc(100vh_-_theme(spacing.16)-_theme(spacing.8))] ",
      false: "",
    },
  },
});
