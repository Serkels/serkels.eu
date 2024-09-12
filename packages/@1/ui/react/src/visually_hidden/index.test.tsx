//

import { render } from "@testing-library/react";
import { expect, test } from "bun:test";
import { VisuallyHidden } from "./index";

//

test("VisuallyHidden", () => {
  const { container } = render(<VisuallyHidden>Bonjour</VisuallyHidden>);
  expect(container.textContent).toEqual("Bonjour");
});
