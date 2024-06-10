//

import dynamic from "next/dynamic";

//

const ReactMarkdown = dynamic<any>(() => import("react-markdown"));

const content = `

# Qui sommes-nous ?


Tout a commencé dans les cafés parisiens. Confronté à des difficultés dans la reprise des études supérieures en France, un groupe d’étudiant.e.s réfugié.e.s s’est réuni pour aider d’autres personnes exilées à accéder l’enseignement supérieur en France. La première fois, 3 personnes sont venues pour être accompagnées dans un café, puis 10, puis 20. C’est ainsi que **l’Union des Étudiant.e.s Exilé.e.s** est née. Notre expérience et savoir-faire nous ont permis de devenir un acteur clé dans la défense d’un accès à l’enseignement supérieur et des conditions d’études favorables pour les personnes exilées. En 2023, nous avons accompagné environ 3000 personnes, de 28 nationalités. Aujourd’hui nous accueillons nos bénéficiaires dans nos locaux au Campus Condorcet, situés à Aubervilliers. Nous avons pour ambition de développer nos actions à l’échelle nationale, en commençant par l’ouverture d’une nouvelle antenne à Grenoble et à Lille début 2024, cette dernière destinée à couvrir toute la région Hauts-de-France. L’ouverture d’une troisième antenne dans la région Rhône-Alpes est prévue d’ici 2025. Pour plus d’infos [site web](https://uniondesetudiantsexiles.org/)

Pour **l’Union des Étudiant.e.s Exilé.e.s (UEE)** il ne faut pas seulement avoir accès aux études, il faut pouvoir les réussir. Parmi les obstacles à la réussite académique pour les étudiant.e.s exilé.e.s, l’isolement peut être un grand défi dans la reprise d’études. Face à la question sur comment faire sortir les étudiant.e.s exilé.e.s de l&#39;isolement social et faciliter le partage entre ceux et celles-ci et les étudiant.e.s francophones, nous avons réfléchi à une réponse innovante et en lien avec les nouvelles technologies...voici comment **Serkels** a vu le jour.

**Serkels** est une plateforme numérique d’échange et d’entraide étudiante. **Serkels** offre une safe space pour réunir les étudiant.e.s de l’enseignement supérieur. Nous voyons **Serkels** comme une solution pour sortir les étudiant.e.s exilé.e.s de l&#39;isolement social et faciliter le partage de leur expérience avec la communauté étudiante dans son ensemble. Sur **Serkels**, un.e étudiant.e exilé.e pourra proposer une heure de cours de guitare gratuite, ou une heure de conversation dans sa langue maternelle, contre de l’aide pour préparer un exposé, ou encore même une invitation collective pour aller à un colloque et partager un moment ensemble ! C’est ça le but de **Serkels** – un monde universitaire où le partage d’expérience contribue à s&#39;unir et à créer un lien durable. Grâce à son guide de l’étudiant.e, **Serkels** sera aussi une mine d’informations pour les étudiant.e.s ou futur.e.s étudiant.e.s en exil. Avec un espace pour publier les annonces de nos partenaires, un.e étudiant.e en exil peut trouver facilement les opportunités qui lui conviennent, comme un stage, un cours de français, une formation ou un job étudiant. **Serkels** aide ces étudiant.e.s en exil à établir leur propre cercle d’amis, de contacts et à se créer des opportunités.

`;

export default function Page() {
  return (
    <main className="container prose mx-auto my-32 lg:prose-xl">
      <ReactMarkdown>{content}</ReactMarkdown>
    </main>
  );
}
