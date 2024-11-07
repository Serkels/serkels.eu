//

import type { _1_HOUR_ } from "@douglasduteil/datatypes...hours-to-seconds";

//

export const revalidate: _1_HOUR_ = 3600;

//

export default function Page() {
  return (
    <main className="mx-auto max-h-fit p-6 md:my-10 md:max-w-3xl">
      <h1 className="my-5 text-center text-2xl font-bold md:my-10 md:text-4xl">
        Questions fréquemment posées
      </h1>

      <article className="flex flex-col gap-5 [&>details>a]:text-secondary [&>details>summary]:cursor-pointer [&>details[open]>summary]:mb-4 [&_a]:text-secondary [&_a]:underline">
        <details>
          <summary className="text-lg font-bold">
            1. Quel niveau de français faut-il pour accéder à l'université ?
          </summary>
          Le niveau de français requis pour accéder l'université est
          généralement le niveau B2. Cependant, pour accéder à une licence, le
          niveau B1 peut suffire suivant les critères de sélection de
          l'université à laquelle vous candidatez.
        </details>
        <details>
          <summary className="text-lg font-bold">
            2. Ai-je besoin d'avoir le niveau B2 en français pour m'inscrire à
            l'université dans une formation en anglais ?
          </summary>
          Non, vous n'avez pas besoin du niveau B2 pour vous inscrire dans une
          formation dont la majorité des cours sont dispensés en anglais. Si
          vous ne venez pas d'un pays anglophone, un justificatif de votre
          niveau d'anglais (comme le TOEIC ou le TOEFL) pourra vous être
          demandé.
        </details>
        <details>
          <summary className="text-lg font-bold">
            3. Je suis sans-papiers / demandeur d'asile / BPI, puis-je
            m'inscrire à l'université ?
          </summary>
          Oui. Les universités en France n'ont pas de compétences préfectorales.
          Cela veut dire qu'une université n'a, en théorie, pas le droit
          d'exiger un statut administratif particulier de la part de ses
          étudiants. Ainsi, un simple document d'identité doit pouvoir suffire à
          vous inscrire à l'université.
          <br />
          <br />
          Attention, certaines universités exigent malgré tout d'être en
          situation régulière. Si vous rencontrez ce problème, veuillez vous
          rapprocher de l'Union des Etudiants Exilés.
        </details>
        <details>
          <summary className="text-lg font-bold">
            4. Puis-je avoir une bourse CROUS ?
          </summary>
          La bourse sur critère du CROUS est attribuée selon des critères
          prédéfinis, comme :
          <ul className="list-disc pl-6">
            <li>Être inscrit à l'université ; </li>
            <li>
              Avoir moins de 28 ans lors de la première demande de bourse ;
            </li>
            <li>Être inscrit à l'université ; </li>
            <li>Suivre ses études à plein temps</li>
          </ul>
          La bourse sur critères sociaux peut-être demandée même une fois les
          délais officiels dépassés. Vous devez effectuer la demande via le site
          du CROUS{" "}
          <a
            rel="noopener noreferrer"
            href="https://www.messervices.etudiant.gouv.fr"
          >
            (https://www.messervices.etudiant.gouv.fr)
          </a>{" "}
          en constituant votre dossier social étudiant.
          <br />
          <br />
          Lien vers la vidéo explicative :{" "}
          <a
            rel="noopener noreferrer"
            href="https://www.youtube.com/watch?v=gkHuuf0MowQ"
          >
            Demande de bourses et de logement - YouTube
          </a>
        </details>
        <details>
          <summary className="text-lg font-bold">
            5. Puis-je avoir le RSA et la bourse CROUS ?
          </summary>
          Non. Il est impossible de cumuler le Revenu de Solidarité Active et la
          bourse sur critères sociaux du CROUS. Si vous êtes bénéficiaire du RSA
          et que vous souhaitez toucher la bourse sur critères sociaux, il vous
          faudra fournir au CROUS une attestation de non-perception du RSA.
          <br />
          <br />
          Il est important de rappeler que la bourse sur critères sociaux est
          versée 10 mois sur 12 (car elle exclue la période estivale), alors que
          le RSA vous sera versé toute l'année tant que vous remplissez les
          conditions (être sans emploi et ne pas toucher de revenus du chômage).
        </details>
        <details>
          <summary className="text-lg font-bold">
            6. Je recherche un logement ?
          </summary>
          <ul className="list-disc pl-6">
            <li>
              Je remplis les critères pour obtenir une bourse sur critères
              sociaux du CROUS : la demande pour un logement universitaire se
              fait en même temps que la demande de bourse, en cochant « demande
              de logement ».
            </li>
            <li>
              Je ne remplis pas les critères pour obtenir une bourse sur
              critères sociaux : plusieurs associations de colocations
              solidaires existent en Ile-de-France (l'AFEV, l'ACLEV, JRS,
              Caracol, etc…). Les loyers proposés par ces colocations sont
              souvent plus accessibles que les solutions de logement dans le
              parc privé. Attention, les listes d'attente peuvent être longues.
            </li>
          </ul>
        </details>
        <details>
          <summary className="text-lg font-bold">
            7. Comment faire reconnaître un diplôme obtenu à l'étranger ?
          </summary>
          Vous avez déjà suivi des études dans votre pays d'origine et avez
          obtenu un diplôme (baccalauréat, licence, master) : vous devez
          demandez une attestation de comparabilité sur la plateforme nationale
          ERIC NARIC
          <a
            rel="noopener noreferrer"
            href="https://phoenix.france-education-international.fr/inscriptions"
          >
            (https://phoenix.france-education-international.fr/inscriptions)
          </a>
          . Ce service est payant et coûte au total 70€ (20€ lors du dépôt du
          dossier et 50€ lors de son instruction).{" "}
          <b>
            Les demandeurs d'asile et bénéficiaires de la protection
            internationale sont exonérés de ces frais.
          </b>{" "}
          <br />
          Obtenir une attestation de comparabilité prend en moyenne 2 à 3 mois.
          <br />
          <br />
          Les documents suivants vous seront demandés :
          <ul>
            <li>
              Une{" "}
              <b>pièce d'identité lisible recto-verso en cours de validité</b>
              (carte d'identité, passeport, carte de séjour, carte de résident).
              <br />
              Les demandeurs d'asile, réfugiés et bénéficiaires de la protection
              subsidiaire ou temporaire doivent justifier d'un document
              attestant du dépôt de la demande d'asile ou de la décision de
              l'OFPRA ou de la CNDA et pourront ainsi bénéficier de la gratuité
              de l'évaluation de leur dossier ;
            </li>
            <li>
              Le <b>diplôme final dans sa langue d'origine</b> (si vous ne le
              possédez pas, transmettre l'attestation de réussite) ;
            </li>
            <li>
              Un <b>justificatif de la durée officielle</b> des études dans la
              langue d'origine délivré par l'établissement : relevés de notes ou
              supplément au diplôme. Si l'usager ne possède pas ces documents,
              il pourra joindre une attestation justifiant la durée de la
              formation délivrée par l'établissement ;{" "}
            </li>
            <li>
              <b>La traduction en français</b> du diplôme et du justificatif de
              durée, effectuée par un traducteur assermenté ou par les autorités
              officielles du pays d'origine.
            </li>
          </ul>
          Source :{" "}
          <a
            rel="noopener noreferrer"
            href="https://www.service-public.fr/particuliers/vosdroits/R38515"
          >
            Demander une attestation de comparabilité d'un diplôme étranger
            (Démarche en ligne) | Service-public.fr
          </a>{" "}
          <br />
          Une traduction officielle (par un.e traducteur.trice assermenté.e)
          vous sera demandée SAUF si votre diplôme est rédigé dans les langues
          suivantes : français, anglais, espagnol, allemand, italien, portugais,
          arabe, ukrainien.
        </details>
        <details>
          <summary className="text-lg font-bold">
            8. Je n'ai pas le BAC, puis-je accéder à l'université ?
          </summary>
          L'accès à l'université français requiert un baccalauréat. Si toutefois
          vous ne disposez pas de ce diplôme, vous pouvez obtenir son équivalent
          avec le DAEU (Diplôme d'Accès aux Etudes Supérieures).
          <br />
          <br />
          Il existe d'autres formations qui ne nécessitent pas d'avoir le
          diplôme du baccalauréat. C'est notamment le cas pour les CAP mais
          aussi pour les études d'aide-soignant.e ou d'auxiliaire de vie dans un
          Institut de Formation en Soins Infirmiers (IFSI).
          <br />
          <br />
          Certains établissements privés peuvent aussi accepter dans leurs
          formations des personnes n'ayant aps le baccalauréat (car il n'existe
          pas de loi précise en ce qui concerne l'intégration d'élèves n'ayant
          pas ce diplôme dans les instituts de formations privés).
        </details>
        <details>
          <summary className="text-lg font-bold">
            9. J'ai plus de 30 ans, ai-je le droit de m'inscrire à l'université
            ?
          </summary>
          Oui. A part quelques rares exceptions, il n'y pas d'âge maximum pour
          accéder à l'université. Si vous rencontrez une discrimination liée à
          votre âge, nous vous invitons à contacter SILLAT.
        </details>
        <details>
          <summary className="text-lg font-bold">
            10.Une personne en demande d'asile a-t-elle le droit de travailler ?
          </summary>
          Un demandeur d'asile ne peut pas exercer d'activité salariée durant
          les 6 premiers mois qui suivent le dépôt de sa demande. Une fois ce
          délai dépassé, une demande d'autorisation peut être déposée auprès de
          l'OFPRA, accompagnée d'une promesse d'embauche ou d'un contrat de
          travail.
          <br />
          <br />
          Attention, la durée de l'autorisation de travail est concomitante à la
          durée du récépissé de dépôt de la demande d'asile. Elle est
          renouvelable jusqu'à la fin de la décision OFPRA (Office Français de
          Protection des Réfugiés et Apatrides), ou le cas échéant, jusqu'à la
          décision de la CNDA (Cour Nationale du Droit d'Asile)
        </details>

        <p className="mt-5">
          Source :{" "}
          <a
            rel="noopener noreferrer"
            href="https://www.service-public.fr/particuliers/vosdroits/F2741"
          >
            Accès au travail du demandeur d'asile | Service-public.fr
          </a>
        </p>
      </article>
    </main>
  );
}
