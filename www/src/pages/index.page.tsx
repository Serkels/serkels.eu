//

import { useMutation } from "@tanstack/react-query";

import { LoginForm } from "@1/ui/login";
import { AppBigBar, Banner } from "@1/ui/shell";
import type { ComponentProps, PropsWithChildren } from "react";
import { match } from "ts-pattern";
import { client } from "../api/client";

//

export function Page() {
  return (
    <>
      <AppBigBar un-h="149px" />
      <HomeBanner />
      <AnonymousExplorer />
    </>
  );
}

//

function HomeBanner() {
  return (
    <Banner>
      <aside>
        <h1 un-text="24px" un-case="upper">
          Avec toc-toc
          <br /> échangez des expériences, cours de langues, activitées notes
          des cours et des opportunités.
        </h1>
        <p>Connectez-vous pour voir toutes les offres d’échanges !</p>
      </aside>
      <aside>
        <ConnectionPanel />
      </aside>
    </Banner>
  );
}

function ConnectionPanel() {
  const mutation = useMutation({
    mutationFn: async (body: object) => {
      const { data, error } = await client.post("/passwordless/send-link", {
        body,
      });

      if (error) throw error;

      return data;
    },
  });

  const onFormSubmit: ComponentProps<typeof LoginForm>["onSubmit"] = ({
    email,
  }) => {
    mutation.mutate(
      { email },
      {
        onSuccess({ email }) {
          //onSubmit(email!);
        },
      }
    );
  };

  const { status } = mutation;

  return match(status)
    .with("idle", () => <LoginForm onSubmit={onFormSubmit} />)
    .with("loading", () => <>Loading.</>)
    .with("error", () => <>Error.</>)
    .with("success", () => <>Success.</>)
    .exhaustive();
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
        <a href="./opportunity" un-text="#023F87">
          <ExplorerLink un-i-brand="binoculars">Opportunités</ExplorerLink>
        </a>
        <a href="./faq" un-text="#782b8f">
          <ExplorerLink un-i-brand="message-group">
            Question réponse
          </ExplorerLink>
        </a>
        <a href="./guide" un-text="#ce118b">
          <ExplorerLink un-i-brand="book">Guide d'étudiante</ExplorerLink>
        </a>
      </nav>
    </section>
  );
}

function ExplorerLink(props: PropsWithChildren<{ "un-i-brand": string }>) {
  const { children, "un-i-brand": icon } = props;
  return (
    <article un-flex="~ col items-center">
      <div un-i-brand={icon} un-text="2rem" un-my="18px" />
      <button
        un-bg="current"
        un-border="none"
        un-rounded="30px"
        un-py="3"
        un-text="current lg"
        un-w="full"
      >
        <span un-text="white" un-case="upper">
          {children}
        </span>
      </button>
    </article>
  );
}
