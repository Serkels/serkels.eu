//

import type { Category } from "@1.modules/category.domain";

//

export function OptionCategories({ categories }: { categories: Category[] }) {
  return categories.map(({ name, id }) => (
    <option value={String(id)} key={id}>
      {name}
    </option>
  ));
}
