//

import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
} from "react";
import { createSlot } from "react-slotify";
import { Search } from "../icons";

export const InputSearch = forwardRef<ElementRef<"input">, InputSearch_Props>(
  function InputSearch({ className, children, ...other_props }, forwardedRef) {
    return (
      <
        // className={button({ className, size, intent, state })}
        // {...props}
      >
        <label
          htmlFor="default-search"
          className="sr-only mb-2 text-sm font-medium"
        >
          Recherche
        </label>

        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-[45%] w-6 text-Dove_Gray" />
          </div>

          <input
            ref={forwardedRef}
            type="search"
            id="default-search"
            className="search-cancel:text-black block w-full rounded-full border border-[#B7B7B7] p-2 pl-12 outline-none"
            placeholder="Recherche"
            {...other_props}
          />
          <div className="absolute inset-y-0 right-3 top-2">
            <InputSearch_RightBtn.Renderer childs={children} />
          </div>
        </div>
      </>
    );
  },
);

export const InputSearch_RightBtn = createSlot();

export default InputSearch;

//

export interface InputSearch_Props extends ComponentPropsWithoutRef<"input"> {}
