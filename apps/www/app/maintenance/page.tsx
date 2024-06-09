//

import SerkelsLogo from ":components/shell/SerkelsLogo";
import { tv } from "tailwind-variants";

export default function Page() {
  const { base, logo, title } = style();
  return (
    <main className={base()}>
      <SerkelsLogo className={logo()} />
      <h1 className={title()}>Comming soon.</h1>
    </main>
  );
}

//

const style = tv({
  base: ["flex flex-col items-center justify-center px-12"],
  slots: {
    logo: "h-[50vh] w-[50vh]",
    title: "-mt-12 text-2xl",
  },
});
