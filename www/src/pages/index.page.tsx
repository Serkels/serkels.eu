//

import { QueryClient, useQuery } from "@tanstack/react-query";
import { Opportunity } from "../api/Opportunity";
import { client } from "../api/client";
import { OpportunityCard } from "./OpportunityCard";

//

export function Page() {
  return (
    <>
      <Header />
      <Banner />
      <AnonymousExplorer />
    </>
  );
}

//

function Header() {
  return (
    <header un-h="42" un-px="1" un-py="3" un-flex="~ items-center">
      <h1 un-text="12" un-flex="~ 1" un-justify="center">
        Toc - Toc
      </h1>
    </header>
  );
}

function Banner() {
  return (
    <section un-p="6" un-bg="stone-900" un-color="white">
      <div
        un-container="~"
        un-gap-x="9"
        un-m="auto"
        un-min-h="lg"
        un-grid="~ cols-1 items-center"
        un-justify-content="space-around"
        un-sm-grid="cols-2 items-center"
        un-sm-h="xl"
      >
        <aside>
          <h1 un-text="7" un-case="upper">
            Avec Toc-Toc échangez et restez en contact avec votre entourage
          </h1>
          <p>Connectez-vous pour voir toutes les offres d’échanges !</p>
        </aside>
        <aside>
          <ConnectionPanel />
        </aside>
      </div>
    </section>
  );
}

function ConnectionPanel() {
  return (
    <form un-bg="white" un-p="lg" un-grid="~ cols-1" un-gap="2xl">
      <input
        type="email"
        name="email"
        id="email"
        placeholder="Adresse email"
        un-placeholder="#aaa"
        un-text="lg"
        un-px="2xl"
        un-h="12"
      />
      <input
        type="button"
        value="Se connecter"
        un-bg="#00adee"
        un-border="none"
        un-color="white"
        un-font="bold"
        un-h="12"
        un-rounded="6"
        un-text="5"
      />
      <hr un-border="neutral" un-w="full" />
      <a
        href="#"
        un-bg="#00adee"
        un-border="none"
        un-color="white"
        un-decoration="none"
        un-font="bold"
        un-h="12"
        un-rounded="6"
        un-text="5 center"
        un-flex="inline items-center justify-center"
      >
        Créer un compte
      </a>
    </form>
  );
}

function AnonymousExplorer() {
  return (
    <section un-container="~" un-m="auto">
      <h1 un-text="center">Explorer sans créer un compte !</h1>

      <nav
        un-m="auto"
        un-grid="~ cols-1 items-center"
        un-gap-y="xl"
        un-sm-gap-x="xl"
        un-md-grid="cols-3"
        un-max-w="3xl"
        un-p="lg"
      >
        <button un-h="12" un-bg="#023f87" un-text="white xl" un-border="none">
          Opportunités
        </button>
        <button un-h="12" un-bg="#782b8f" un-text="white xl" un-border="none">
          Questions et réponses
        </button>
        <button un-h="12" un-bg="#ce118b" un-text="white xl" un-border="none">
          Guide d’étudiante
        </button>
      </nav>

      <div un-relative="~" un-max-w="lg" un-m="auto" un-p="lg">
        <div
          un-absolute="~"
          un-flex="~ items-center"
          un-pl="3xl"
          un-left="0"
          un-inset-y="0"
          un-pointer-events="none"
        >
          <div un-i-simple-line-icons="magnifier" />
        </div>
        <input
          type="search"
          name="search"
          id="search"
          placeholder="Rechercher"
          un-block="~"
          un-h="12"
          un-placeholder="#aaa"
          un-px="2xl"
          un-pl="10"
          un-rounded="6"
          un-text="lg"
          un-w="full"
        />
      </div>

      <section
        un-container="~"
        un-m="auto"
        un-grid="~ cols-1 "
        un-md-grid-cols="[222px_1fr]"
        un-gap="xl"
      >
        <aside>
          <article
            un-bg="neutral-200"
            un-p="lg"
            un-md-position="sticky"
            un-inset-y="0"
          >
            <h3>Liste de propositions</h3>

            <ul un-list="none">
              <li>
                <input type="checkbox" name="cours-de-fr" id="cours-de-fr" />
                <label htmlFor="cours-de-fr">Cours de français</label>
              </li>
              <li>
                <input type="checkbox" name="bourses" id="bourses" />
                <label htmlFor="bourses">Bourses</label>
              </li>
            </ul>
          </article>
        </aside>
        <OpportunityCardDeck />
      </section>
    </section>
  );
}
async function fetcher() {
  const { data, error } = await client.get("/opportunities", {
    params: { query: {} },
  });
  if (error) throw error;
  if (!data || !data.data) return [];
  return data.data.map((op) => Opportunity(op));
}

export const prefetchQueries: Array<Parameters<QueryClient["prefetchQuery"]>> =
  [[["opportunities", 10], fetcher]];
// async function getOpportunities() {
//   console.log("run client opportunities ?");
//   return hc<API_Opportunities>(import.meta.env.BASE_URL).opportunities.$get;
// }

function OpportunityCardDeck() {
  const { data, isLoading, isSuccess } = useQuery({
    queryKey: ["opportunities", 10],
    queryFn: fetcher,
  });

  if (isLoading) return <aside>⚡ Fetching ⚡</aside>;
  if (!isSuccess) return <aside>Un error occurred 💀</aside>;
  if (data.length === 0) return <aside>Nothing for now 👀</aside>;

  return (
    <aside
      un-grid="~ cols-1 flow-row"
      un-gap="xl"
      un-px="xl"
      un-sm-px="0"
      un-sm-grid="cols-2"
      un-md-grid="cols-3"
      un-lg-grid="cols-4"
      un-xl-grid="cols-5"
    >
      {data.map((opportunity, key) => (
        <OpportunityCard key={key} {...opportunity} />
      ))}
    </aside>
  );
}
