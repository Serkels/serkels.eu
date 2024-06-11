//

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
    <ul className="mt-7 pl-4 text-Dove_Gray md:pl-0">
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
