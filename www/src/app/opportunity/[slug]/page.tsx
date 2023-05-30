//

import { UserBar } from "@/(index)/UserBar";
import { InputSearch } from "@1/ui/components/InputSearch";
import { Footer } from "@1/ui/shell";
import { SeeAlso } from "./SeeAlso";

//

export default async function Page() {
  const now = await getServerDate();
  return (
    <>
      <UserBar />
      <Opportunity />
      <Footer now={now} />
    </>
  );
}

//

function Opportunity() {
  return (
    <div className="grid justify-between px-1 lg:grid-cols-holy-grail">
      <aside className="hidden shadow lg:block lg:px-10">
        <article className="mt-10 ">
          <h3 className="font-bold uppercase text-Congress_Blue">
            Opportunités
          </h3>

          <InputSearch />
          <ul></ul>
        </article>
      </aside>
      <main className="bg-white ">
        <OpportunityArticle />
      </main>
      <aside className="lg:px-10">
        <SeeAlso category="category-X" />
      </aside>
    </div>
  );
}

function OpportunityArticle() {
  return (
    <article className="px-20 py-10">
      <h1 className="text-3xl font-bold">
        Bourse Saif Benoît Schaeffer pour l'édition photographique
      </h1>

      <header className="flex items-center justify-between py-4">
        <figure className="flex items-center">
          <img
            className="mr-4 block rounded-full"
            width="30"
            height="30"
            src="https://source.unsplash.com/random/30x30/?school"
          />
          <figcaption>Université Paris 11</figcaption>
        </figure>
        <small className="font-bold text-Chateau_Green">
          Date limite : 30/03/2023
        </small>
      </header>

      <div className="mb-10">
        <p>
          L'hôtel West End, hôtel prestigieux de la Promenade des anglais
          accueille cette année à nouveau le Prix OVNi Sud Emergence une
          sélection d'artistes de moins de 39 ans, résidant en région
          Provence-Alpes-Côte d'Azur.
          <br /> L'objectif : promouvoir et valoriser les artistes émergents de
          la région en offrant des rencontres avec des professionnels, des
          artistes locaux, nationaux et internationaux.
          <br />
          <br /> <b>Le déroulé</b> :
          <ul>
            1. Envoi des candidatures : prolongement jusqu'au 20 mai ! 2.
            Premier comité de sélection de 13 artistes 3. Exposition dans les
            chambres de l'Hôtel West End du 1 au 3 décembre 4. Second jury de
            sélection pour les lauréats du Prix
          </ul>
          <br />
          <br /> Le Prix : résidence à l'Hôtel WindsoR, soutenue par la DRAC à
          hauteur de 2000 euros, présentation au comité d'achat du FRAC et
          restitution de résidence pour OVNi 2024.
        </p>
      </div>

      <footer className="flex justify-between">
        <figure className="flex items-center">
          <img
            className="mr-4 h-8 w-8 rounded-full"
            width="30"
            height="30"
            src="https://source.unsplash.com/random/30x30/?paris"
          />
          <figcaption>Paris</figcaption>
        </figure>

        <a href="/">
          <figure className="flex items-center">
            <img
              className="mr-4 h-8 w-8  rounded-full"
              src="https://source.unsplash.com/random/30x30/?lien web"
            />
            <figcaption>Lien web</figcaption>
          </figure>
        </a>

        <figure className="flex items-center">
          <img
            className="mr-4 h-8 w-8  rounded-full"
            src="https://source.unsplash.com/random/30x30/?partager"
          />
          <figcaption>Partager</figcaption>
        </figure>
      </footer>
    </article>
  );
}

async function getServerDate() {
  return new Date().toISOString();
}
