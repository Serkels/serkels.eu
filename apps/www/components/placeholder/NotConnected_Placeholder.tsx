//

import { Banner } from ":components/shell/Banner";

//

export function NotConnected_Placeholder() {
  return (
    <main className="h-full">
      <Banner className="col-span-full h-full bg-black/75 text-white">
        <main className="container mx-auto max-w-5xl">
          <h1
            className={`
            mx-auto
            my-16
            text-center
            text-6xl
            font-extrabold
            sm:text-7xl
            lg:text-8xl
          `}
          >
            🚪 <br /> Cette page n'est pas accessible
          </h1>
          <p className="my-0 px-6 text-center text-2xl">
            Vous n'êtes pas connecté ou votre session a expiré.
            <br />
            Pour accéder à cette page, veuillez retourner sur la page d'accueil
            et vous connecter.
            <br />
            Merci.
          </p>
        </main>
      </Banner>
    </main>
  );
}
