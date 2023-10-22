//

import type { Studient } from "@1.modules/profile.domain";
import { Avatar } from "@1.modules/profile.ui";
import { StudientAvatarMedia } from "@1.modules/profile.ui/avatar";
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

// import { Aside_NavBar } from "./aside_navbar.client";

// import {
//   Aside_NavBar,
//   Header,
//   Li_Link,
//   SubNav_Bookmarks,
// } from "./aside_navbar.client";

//

// export function Studient_NavBar() {
//   return;
//   // return (
//   //   <Aside_NavBar>
//   //     <Header className="py-5" />
//   //     {/* <Studient_Nav /> */}
//   //   </Aside_NavBar>
//   // );
// }

// export function Partner_NavBar() {
//   // return (
//   //   <Aside_NavBar>
//   //     <Header className="py-5" />
//   //     {/* <Partner_Nav /> */}
//   //   </Aside_NavBar>
//   // );
// }
export function Studient_NavBar({ studient }: { studient: Studient }) {
  return (
    <nav className={navbar()}>
      <StudientAvatarMedia
        tv$direction="column"
        className="py-5"
        studient={studient}
      />
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
export function Partner_NavBar() {
  return <aside className={navbar()}>Studient_NavBar</aside>;
}
export const aside_navbar = tv({
  base: "py-5 pt-10 ",
  variants: {},
});
const navbar = tv({
  base: "py-5 pt-10 ",
  variants: {
    $alone: {
      // true: "block max-h-[calc(100vh_-_theme(spacing.16)-_theme(spacing.8))] ",
      false: "",
    },
  },
});
/*

const aside_bar = tv({
  base: "",
  slots: {
    container: `
      fixed
      left-0
      top-0
      z-50
      h-screen
      w-72
      overflow-y-auto
      bg-white
      transition-transform
    `,
    close_button: `
      z-60
      absolute
      right-4
      top-4
      inline-flex
      items-center
      rounded-lg
      bg-transparent
      p-1.5
      text-sm
      text-[#707070]
      hover:bg-gray-200
      hover:text-gray-900
    `,
    close_icon: "h-6 w-6",
    body: "mt-20",
  },
  variants: {
    hidden: {
      true: { container: "-translate-x-full" },
    },
  },
});

function Partner_Nav() {
  return (
    <nav>
      <ul>
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

function Studient_Nav() {
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
*/
