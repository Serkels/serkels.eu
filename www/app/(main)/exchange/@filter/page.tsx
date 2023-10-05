//

import { CategoriesList, SearchForm } from "./page.client";

export default function Page() {
  return (
    <article>
      <h3 className="text-2xl font-bold uppercase text-Congress_Blue">
        Échanges
      </h3>

      <SearchForm />

      <hr className="my-10" />

      <CategoriesList />
    </article>
  );
}
