//

export function BlockedInfoMessage({ name }: { name: string }) {
  return (
    <ul className="list-disc">
      <li>Vous ne pourrez plus envoyer de message à {name}</li>
      <li>Vous ne recevrez plus de message de {name}</li>
      <li>
        Si vous débloquez {name}, vous ne recevrez rien de ce qui aurait pu être
        envoyé pendant le blocage
      </li>
      <li>Les échanges que {name} a créés ne seront plus visibles</li>
      <li>{name} ne pourra plus voir vos échanges</li>
      <li>Les questions que {name} a créés ne seront plus visibles</li>
      <li>{name} ne pourra plus voir vos questions</li>
    </ul>
  );
}
