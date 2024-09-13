//

import type { Exchange } from "@1.modules/exchange.domain";
import { render } from "@testing-library/react";
import { beforeAll, expect, setSystemTime, test } from "bun:test";
import { TitleHeader } from "./TitleHeader";

//

beforeAll(() => {
  setSystemTime(new Date("2022-11-11"));
});

test("should link to the exchange", () => {
  const exchange = {
    deals: [],
    expiry_date: new Date("2022-11-11"),
    id: "vulfpeck-joe-dart-masterclass",
    title: "Joe Dart Masterclass",
    places: 1,
    updated_at: new Date("2022-11-11"),
  } satisfies Partial<Exchange>;
  const { container } = render(<TitleHeader exchange={exchange} />);
  expect(container.outerHTML).toMatchSnapshot();
});

test("should say the exchange expired a day ago", () => {
  const exchange = {
    deals: [],
    expiry_date: new Date("2022-11-10"),
    id: "vulfpeck-joe-dart-masterclass",
    title: "Joe Dart Masterclass",
    places: 1,
    updated_at: new Date("2022-11-11"),
  } satisfies Partial<Exchange>;
  const { container } = render(<TitleHeader exchange={exchange} />);
  expect(container.outerHTML).toMatchSnapshot();
});

test("should say the exchange is complete depuis 1 mois", () => {
  const exchange = {
    deals: [{ id: "douglas-play-bass" }],
    expiry_date: null,
    id: "vulfpeck-joe-dart-masterclass",
    title: "Joe Dart Masterclass",
    places: 1,
    updated_at: new Date("2022-10-11"),
  } satisfies Partial<Exchange>;
  const { container } = render(<TitleHeader exchange={exchange} />);
  expect(container.outerHTML).toMatchSnapshot();
});
