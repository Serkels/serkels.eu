//

import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
} from "react";

//

export default async function Page() {
  return (
    <div className="mx-auto grid w-[637px] grid-rows-[auto_1fr_auto] items-center justify-center">
      <h2 className="py-20 text-center text-2xl">Que recherches-tu ?</h2>

      <ul className="grid grid-cols-3 gap-x-9 gap-y-12">
        <li>
          <Button>Bourse</Button>
        </li>
        <li>
          <Button>Logement</Button>
        </li>
        <li>
          <Button>Équivalence</Button>
        </li>
        <li>
          <Button>Apprendre le français</Button>
        </li>
        <li>
          <Button>Reprendre mes études</Button>
        </li>
        <li>
          <Button>Autres</Button>
        </li>
      </ul>

      {/* <progress></progress> */}
    </div>
  );
}

const Button = forwardRef<
  ElementRef<"button">,
  ComponentPropsWithoutRef<"button">
>(function InputSearch(props, forwardedRef) {
  const { className, children, ...other_props } = props;
  return (
    <button
      className="h-[99px] w-[189px] rounded-[20px] border-[#00000017] bg-white px-5 uppercase text-[#656565] shadow-primary"
      ref={forwardedRef}
      {...other_props}
    >
      {children}
    </button>
  );
});
