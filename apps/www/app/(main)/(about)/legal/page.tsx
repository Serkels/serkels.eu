//

import dynamic from "next/dynamic";

//

const ReactMarkdown = dynamic<any>(() => import("react-markdown"));

const content = `
# Politique d'utilisation

> Conicio comis magnam tristis argentum aduro. Solium coepi argumentum virtus nulla amita approbo volubilis canto. Admoveo dolorum color bibo abduco sint avaritia aro.

Argentum ceno carbo ustilo stabilis decet avaritia desipio. Subnecto certus veritatis et tracto benigne capitulus vestrum cariosus vindico. Vallum triumphus demum.
Maxime viriliter canonicus clibanus sed corpus volutabrum tumultus aliqua cohibeo. Apostolus aureus vilis aliquam appositus teres talio strenuus vehemens. Defendo calcar spes cultellus excepturi via cubitum defendo adinventitias.
Causa chirographum temperantia caelum. Valeo amplitudo stillicidium cognatus denuo turbo comitatus vilicus tui defungo. Stipes valetudo asperiores arcus coepi nobis antiquus vos aetas.
Statua carcer caritas demulceo creta. Debitis venia qui. Adulescens demo natus adopto arcus abscido collum.
Vos talio caecus. Minus appono votum provident adstringo universe custodia cognatus. Vaco calculus viduo utor trans crur vociferor calcar patrocinor.
Derideo virtus caelum basium tamdiu decipio voluntarius. Tego aegre denuo circumvenio. Delinquo appositus approbo solio adimpleo arca ullam vitium creator.
Claustrum demum tumultus suscipio tracto adeptio demitto succedo. Adfectus auctus canonicus quos arx valetudo derideo esse theca sponte. Tamen dolore terminatio.
Tui curiositas perspiciatis cuius infit. Contigo somnus vulgo tergum custodia temeritas sulum. Curiositas paens utrimque nemo deorsum capillus corona curso.
Arguo theca cena umbra veritatis. Solitudo triduana crebro virga calamitas cruciamentum spes tergo. Aliquam paulatim alienus cum utrum demoror.'

`;

export default function Page() {
  return (
    <main className="container prose mx-auto my-32 lg:prose-xl">
      <ReactMarkdown>{content}</ReactMarkdown>
    </main>
  );
}
