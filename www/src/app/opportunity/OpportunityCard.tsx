"use client";

//

export function OpportunityCard(props: Props) {
  const { title } = props;
  return (
    <article className="rounded border border-neutral-200 bg-white shadow-md">
      <figure>
        <img
          className="w-full object-cover lg:h-[112px]"
          src="https://source.unsplash.com/random/242x163/?scholarship"
        />
        <figcaption className="p-3">
          <small className="font-bold text-Chateau_Green">
            Date limite : 30/03/2023
          </small>

          <h3 className="my-4 text-sm font-bold">{title}</h3>
          <p>Université Paris 11</p>
          <p>📍Paris</p>
        </figcaption>
        <hr />
        <footer className="flex justify-between p-3">
          <aside>Bourses</aside>
          <aside>
            <button>↗️</button>
          </aside>
        </footer>
      </figure>
    </article>
  );
}

type Props = Partial<{
  id: number;
  title: string | undefined;
  expireAt: string;
  description: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string;
  link: string;
  location: string;
}>;
