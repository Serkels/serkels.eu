//

export function OpportunityCard(props: Props) {
  const { image, title, expireAt, description } = props;
  const imageSrc =
    image ??
    "https://source.unsplash.com/random/242x163/?" + title.split(" ").join("+");
  return (
    <article un-border="1 solid neutral-200" un-rounded="~" un-shadow="md">
      <figure un-m="0">
        <img
          width="163"
          src={imageSrc}
          un-h="42"
          un-w="full"
          un-object="cover"
        />
        <figcaption un-p="4">
          <small>
            Date limite :{" "}
            <time dateTime={expireAt.toLocaleDateString()}>
              {expireAt.toLocaleDateString()}
            </time>
          </small>

          <h3>{title}</h3>

          <p>Université Paris 11</p>
          <p>Paris</p>

          <footer>
            <aside>Bourses</aside>
            <aside></aside>
          </footer>
        </figcaption>
      </figure>
    </article>
  );
}

type Props = {
  image?: string;
  title: string;
  description: string;
  expireAt: Date;
};
