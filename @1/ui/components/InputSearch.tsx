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
    <form>
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
            className="h-4 w-4 text-Dove_Gray"
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
          required
          {...other_props}
        />

        {/* <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <svg
            aria-hidden="true"
            fill="none"
            className="h-5 w-5 text-[#B7B7B7]"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6 13.5V3.75m0 9.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 3.75V16.5m12-3V3.75m0 9.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 3.75V16.5m-6-9V3.75m0 3.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 9.75V10.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
          </svg>
        </div> */}
      </div>
    </form>
    // <input
    //   ref={forwardedRef}
    //   type="search"
    //   placeholder="Recherche"
    //   className={clsx(
    //     `
    //       w-full
    //       rounded-full
    //       border-[#E5E3E3]
    //       p-4
    //       text-xs
    //     `,
    //     className
    //   )}
    //   {...other_props}
    // />
  );
});
