import { Spinner } from "@1/ui/components/Spinner";

export default function Loading() {
  return (
    <>
      <h1
        className={`
      mx-auto
      my-0
      text-center text-6xl
      font-extrabold
      sm:text-7xl
      lg:text-8xl
    `}
      >
        Vérification
      </h1>
      <div className="mx-auto mt-5 text-center">
        <Spinner />
      </div>
    </>
  );
}
