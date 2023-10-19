//

import type { Category } from "@1/modules/category/domain";

export function CategoryFilterRadioList(props: {
  data: Category[];
  active: string;
  name: string;
  onChange: (value: string) => void;
}) {
  const data = props.data.map((category) => ({
    name: category.name,
    slug: category.slug,
  }));
  return <FilterRadioList {...props} data={data} />;
}

export function FilterRadioList({
  active,
  data,
  name: input_name,
  onChange,
}: {
  data: { name: string; slug: string }[];
  active: string;
  name: string;
  onChange: (value: string) => void;
}) {
  return (
    <ul className="mt-7 text-Dove_Gray">
      {data.map(({ name, slug }) => (
        <li className="mb-3" key={slug}>
          <label>
            <input
              type="radio"
              name={input_name}
              value={slug}
              checked={active === slug}
              onChange={() => onChange(slug)}
            />
            <span className="ml-2">{name}</span>
          </label>
        </li>
      ))}
    </ul>
  );
}
