//

//

export function AppBar() {
  return (
    <header un-px="1" un-py="3" un-flex="~ items-center">
      <div un-flex="~ 1" un-px="1rem" un-sm-px="2rem">
        <h1 un-flex="~ 1" un-justify="center">
          <a href="/">Toc - Toc</a>
        </h1>

        <button>Login</button>
      </div>
    </header>
  );
}

//

type Props = { position: string };
