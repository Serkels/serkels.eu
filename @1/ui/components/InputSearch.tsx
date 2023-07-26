//

import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
} from "react";

//

export const InputSearch = forwardRef<
  ElementRef<"input">,
  ComponentPropsWithoutRef<"input">
>(function InputSearch(props, forwardedRef) {
  const { className, ...other_props } = props;
  return (
    <>
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
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
        </div>

        <input
          ref={forwardedRef}
          type="search"
          id="default-search"
          className="block w-full rounded-full border border-[#B7B7B7] p-3 pl-9 text-xs outline-none search-cancel:text-black"
          placeholder="Recherche"
          {...other_props}
        />
      </div>
    </>
  );
});
