//

import dynamic from "next/dynamic";

//

const ReactMarkdown = dynamic<any>(() => import("react-markdown"));

const content = `
# Qui sommes-nous ?

> Nemo tepidus aestas. Cubicularis suscipit delicate ducimus tantum ipsam taceo nisi stipes talio. Amicitia conculco damno confero suus.

Viriliter possimus sequi cupio nesciunt cauda theca aduro. Crur vigilo deorsum concedo coma umbra auctus uxor vaco. Appositus mollitia verus textus substantia alias.
Textus aestus volaticus dolorum curis amicitia claustrum occaecati possimus. Demonstro accusamus cornu tamdiu bos. Angustus decumbo curo nulla solio minima crapula ulterius suffragium.
Congregatio arcus delicate recusandae conicio arcesso caelestis. Spoliatio currus conor solutio solio conitor denego. Utroque verecundia taceo condico ars ambulo copiose.
Fuga argentum maxime accusantium verto venia. Acceptus nihil magnam contigo summopere. Desipio venustas tam cohors terra cavus libero argumentum necessitatibus officiis.
Depono conturbo incidunt canto accusator. Adamo coniecto appono tredecim aliqua velut terga auctus careo dolorem. Summa solvo vitae sint vigilo.
Alioqui beatae avaritia modi. Copia tripudio cuius. Amissio bonus audeo comminor ea apparatus vivo caritas.
Cernuus communis defungo tricesimus currus. Vilitas amaritudo tutamen nulla vinculum tollo. Autus validus defluo verbum sunt.
Cur deprecator arbustum bellicus thermae consequuntur. Abduco asperiores voluntarius defessus caelestis porro acervus adamo cenaculum conforto. Aveho qui deludo absconditus suspendo antiquus.
Celer comparo modi creator quas. Accusamus fugit demonstro illo aeneus aqua. Cogito vehemens summisse ciminatio stipes amet assentator supellex.
`;

export default function Page() {
  return (
    <main className="container prose mx-auto my-32 lg:prose-xl">
      <ReactMarkdown>{content}</ReactMarkdown>
    </main>
  );
}
