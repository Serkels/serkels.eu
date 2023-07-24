///

import { AppFooter } from "@/components/AppFooter.server";
import { AvatarMediaVertical } from "@/components/Avatar";
import { UserBar } from "@/components/UserBar";
import { AsideBar } from "@/layouts/holy/aside";
import { Grid } from "@1/ui/components/Grid";
import Link from "next/link";
import type { ComponentPropsWithoutRef, PropsWithChildren } from "react";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="grid min-h-screen grid-rows-[max-content_1fr_max-content]">
      <UserBar />
      <Grid>
        <AsideNav />
        {children}
      </Grid>
      <AppFooter />
    </div>
  );
}

function AsideNav(props: ComponentPropsWithoutRef<"aside">) {
  const { children, ...other_props } = props;
  return (
    <AsideBar {...other_props}>
      <div className="sticky top-[calc(66px_+_24px)]">
        <AvatarMediaVertical className="my-8" />
        <nav>
          <ul>
            <li>
              <Link href="/my/profile">Créer</Link>
            </li>
            <li>
              <Link href="/my/profile">Mes annonces</Link>
            </li>
            <li>
              <Link href="/my/profile">Mes échanges</Link>
            </li>
            <li>
              <Link href="/my/profile">Sauvgardes</Link>
            </li>
            <li>
              <Link href="/my/profile">Groupes</Link>
            </li>
            <li>
              <Link href="/my/profile">Messagerie</Link>
            </li>
            <li>
              <Link href="/my/profile">Profil</Link>
            </li>
            <li>
              <Link href="/my/parameters">Paramètres</Link>
            </li>
          </ul>
        </nav>
      </div>
    </AsideBar>
  );
}
