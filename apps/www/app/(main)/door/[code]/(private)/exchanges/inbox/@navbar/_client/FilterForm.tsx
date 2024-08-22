"use client";

import { useSyncSearchQuery } from ":components/hooks/useSyncSearchQuery";
import { filter_params_schema } from "@1.modules/exchange.domain/filter_params_schema";
import { button as ui_button } from "@1.ui/react/button/atom";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { type ComponentPropsWithoutRef } from "react";
import { tv } from "tailwind-variants";

//

export default function FilterForm({
  className,
  ...props
}: ComponentPropsWithoutRef<"div">) {
  const { filter_query, in_progress_params, successful_params } =
    use_form_form();

  //

  const { base, button } = search_form_classes();

  return (
    <div className={base({ className })} {...props}>
      <Link
        className={button({
          active: filter_query === filter_params_schema.enum.IN_PROGRESS,
          intent: "secondary",
        })}
        href={{ query: in_progress_params.toString() }}
      >
        En cours
      </Link>
      <Link
        className={button({
          active: filter_query === filter_params_schema.enum.SUCCESS,
          intent: "primary",
        })}
        href={{ query: successful_params.toString() }}
      >
        Réussis
      </Link>
    </div>
  );
}

//

function use_form_form() {
  const search_params = useSearchParams();
  const in_progress_params = new URLSearchParams(search_params);
  in_progress_params.set("f", "in_progress");
  const successful_params = new URLSearchParams(search_params);
  successful_params.set("f", "success");

  const { query } = useSyncSearchQuery("f");

  const filter_query = filter_params_schema.safeParse(query);

  return {
    in_progress_params,
    successful_params,
    filter_query: filter_query.data ?? filter_params_schema.enum.IN_PROGRESS,
  };
}

const search_form_classes = tv({
  base: `flex gap-4`,
  slots: {
    button: "flex-1 whitespace-nowrap",
  },
  variants: {
    active: {
      false: {
        button: "font-normal opacity-50  hover:opacity-100",
      },
      true: {
        button: "font-bold opacity-100 shadow-md",
      },
    },
    intent: {
      primary: {
        button: ui_button({ intent: "primary", size: "lg" }),
      },
      secondary: {
        button: ui_button({ intent: "secondary", size: "lg" }),
      },
    },
  },
});
