//

export function FilterRadioList({
  data,
  active,
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
