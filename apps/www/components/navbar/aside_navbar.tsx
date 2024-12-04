//

import type { Partner, Student } from "@1.modules/profile.domain";
import { Avatar } from "@1.modules/profile.ui";
import {
  PartnerAvatarMedia,
  StudentAvatarMedia,
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
import {
  NewsInExchange_Indicator,
  NewsInMessage_Indicator,
} from "./notification_indicator.client";
import { TrpcRootProvider } from ":trpc/root";

//

export function Student_NavBar({
  student,
  className,
  onClickLink,
}: {
  student: Student;
  className?: string;
  onClickLink?: () => void;
}) {
  const { list, base } = navbar();
  return (
    <nav className={base({ className })}>
      <StudentAvatarMedia
        tv$direction="column"
        className="py-5"
        student={student}
      />
      <ul className={list()}>
        <Li_Link
          onClick={onClickLink}
          icon={<Exchange />}
          href="./exchanges/inbox"
        >
          Cercles d'échanges
          <TrpcRootProvider>
            <NewsInExchange_Indicator />
          </TrpcRootProvider>
        </Li_Link>
        <Li_Link
          onClick={onClickLink}
          icon={<PlusBox />}
          href="./exchanges/new"
        >
          Créer un échange
        </Li_Link>
        <Li_Link
          onClick={onClickLink}
          icon={<Archive />}
          href="./exchanges/mine"
        >
          Mes publications
        </Li_Link>
        <Li_Link icon={<Bookmark />} href="./bookmarks">
          Mes sauvegardes
        </Li_Link>
        <SubNav_Bookmarks href="./bookmarks">
          <Li_Link
            onClick={onClickLink}
            icon={<Exchange className="h-auto w-6" />}
            href="./bookmarks/exchanges"
          >
            Échanges
          </Li_Link>
          <Li_Link
            onClick={onClickLink}
            icon={<Binoculars className="h-auto w-6" />}
            href="./bookmarks/opportunities"
          >
            Opportunités pros
          </Li_Link>
        </SubNav_Bookmarks>
        <Li_Link onClick={onClickLink} icon={<Envelope />} href="./inbox">
          Messages privés
          <TrpcRootProvider>
            <NewsInMessage_Indicator />
          </TrpcRootProvider>
        </Li_Link>
        <Li_Link
          onClick={onClickLink}
          icon={<Avatar className="h-full" profile={student.profile} />}
          href="./"
          is_active_includes={["./", "./history", "./proposals"]}
        >
          Profil
        </Li_Link>
        <Li_Link onClick={onClickLink} icon={<Gear />} href="./parameters">
          Paramètres
        </Li_Link>
        <Li_Link onClick={onClickLink} icon={<Exit />} href="/logout">
          Me déconnecter
        </Li_Link>
      </ul>
    </nav>
  );
}

//

export function Partner_NavBar({
  partner,
  className,
  onClickLink,
}: {
  partner: Partner;
  className?: string;
  onClickLink?: () => void;
}) {
  const { profile } = partner;
  const { list, base } = navbar();
  return (
    <nav className={base({ className })}>
      <PartnerAvatarMedia
        tv$direction="column"
        className="py-5"
        partner={partner}
      />
      <ul className={list()}>
        <Li_Link
          onClick={onClickLink}
          icon={<PlusBox />}
          href="./opportunities/new"
        >
          Créer une opportunité
        </Li_Link>
        <Li_Link
          onClick={onClickLink}
          icon={<Archive />}
          href="./opportunities/mine"
        >
          Mes publications
        </Li_Link>
        <Li_Link
          onClick={onClickLink}
          icon={<Avatar className="h-full" profile={profile} />}
          href="./"
          is_active_includes={["./history", "./exchanges"]}
        >
          Profil
        </Li_Link>
        <Li_Link onClick={onClickLink} icon={<Gear />} href="./parameters">
          Paramètres
        </Li_Link>
        <Li_Link onClick={onClickLink} icon={<Exit />} href="/logout">
          Me déconnecter
        </Li_Link>
      </ul>
    </nav>
  );
}

const navbar = tv({
  base: "sticky top-0 py-5",
  slots: {
    list: "mx-auto flex flex-col justify-center",
  },
  variants: {
    $alone: {
      // true: "block max-h-[calc(100vh_-_theme(spacing.16)-_theme(spacing.8))] ",
      false: "",
    },
    $mobile: {},
  },
});
