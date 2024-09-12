//

import type { PropsWithChildren } from "react";
import { createSlot } from "react-slotify";
import { tv, type VariantProps } from "tailwind-variants";

export function Conversation(
  props: PropsWithChildren<{ variant?: VariantProps<typeof layout> }>,
) {
  const { children, variant, ...other_props } = props;
  const { base, body, footer, header } = layout(variant);
  return (
    <section className={base()} {...other_props}>
      <header className={header()}>
        <Conversation.Header.Renderer childs={children} />
      </header>
      <div className={body()}>
        <Conversation.Body.Renderer childs={children} />
      </div>
      <footer className={footer()}>
        <Conversation.Footer.Renderer childs={children} />
      </footer>
    </section>
  );
}
Conversation.Header = createSlot();
Conversation.Body = createSlot();
Conversation.Footer = createSlot();

const layout = tv({
  base: `
    grid
    h-full
    max-h-@main
    grid-rows-[auto_1fr_auto]
    overflow-hidden
    bg-white
    text-black
    [&>*]:px-7
   `,
  slots: {
    body: `
      max-h-full
      overflow-y-auto
      py-4
      pr-5
    `,
    header: `
      flex
      flex-row
      items-center
      gap-2
      space-x-3
      py-4
      md:py-7
    `,
    footer: `
      flex
      min-h-@footer
      flex-col
      items-center
      justify-center
      space-y-4
      bg-white
      py-5
      text-black
    `,
  },
});
