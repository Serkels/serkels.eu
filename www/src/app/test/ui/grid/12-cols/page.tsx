//

export default function Page() {
  return (
    <main>
      <footer className="fixed bottom-0 right-0 bg-white text-red-500 opacity-50">
        12 Columns
      </footer>

      <div
        className={`
          fixed
          left-0
          right-0
          mx-auto
          grid
          h-screen
          grid-cols-4
          gap-4
          px-4
          text-center
          opacity-20
          max-lg:container
          sm:grid-cols-6
          sm:px-8
          md:grid-cols-8
          md:gap-6
          md:px-6
          lg:grid-cols-12
          `}
      >
        <div className="bg-gray-200 pt-6">1</div>
        <div className="bg-gray-200 pt-6">2</div>
        <div className="bg-gray-200 pt-6">3</div>
        <div className="bg-gray-200 pt-6">4</div>
        <div className="hidden bg-gray-200 pt-6 sm:block">5</div>
        <div className="hidden bg-gray-200 pt-6 sm:block">6</div>
        <div className="hidden bg-gray-200 pt-6 md:block">7</div>
        <div className="hidden bg-gray-200 pt-6 md:block">8</div>
        <div className="hidden bg-gray-200 pt-6 lg:block">9</div>
        <div className="hidden bg-gray-200 pt-6 lg:block">10</div>
        <div className="hidden bg-gray-200 pt-6 lg:block">11</div>
        <div className="hidden bg-gray-200 pt-6 lg:block">12</div>
      </div>
      <div className="z-10 mx-auto hidden h-screen grid-cols-3 justify-between gap-6 px-6 text-center xl:flex">
        <div className=" w-[290px] bg-gray-300 pt-9">1-2-3</div>

        <div className=" w-[604px] bg-gray-300 pt-9">4-5-6-7-8_9</div>

        <div className=" w-[290px] bg-gray-300 pt-9">10-11-12</div>
      </div>
    </main>
  );
}
