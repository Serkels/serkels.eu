//

import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
} from "react";

export const InputSearch = forwardRef<ElementRef<"input">, InputSearch_Props>(
  function InputSearch({ className, ...other_props }, forwardedRef) {
    return (
      <
        // className={button({ className, size, intent, state })}
        // {...props}
      >
        <label
          htmlFor="default-search"
          className="sr-only mb-2 text-sm font-medium "
        >
          Recherche
        </label>

        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <svg
              aria-hidden="true"
              className="h-[45%] text-Dove_Gray"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                className="fill-current"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
          </div>

          <input
            ref={forwardedRef}
            type="search"
            id="default-search"
            className="search-cancel:text-black block w-full rounded-full border border-[#B7B7B7] p-3 pl-9 text-xs outline-none"
            placeholder="Recherche"
            {...other_props}
          />
        </div>
      </>
    );
  },
);

export default InputSearch;

//

export interface InputSearch_Props extends ComponentPropsWithoutRef<"input"> {}
