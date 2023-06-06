//

export default function Page() {
  return (
    <main>
      <footer className="fixed bottom-0 right-0 bg-white text-red-500 opacity-50">
        Holy 3 + 6 cols
      </footer>
      <header className="fixed w-full opacity-20">
        <div className=" mx-auto grid h-screen max-w-[1085px] grid-cols-10 gap-[35px] text-center">
          <div className="bg-gray-400">1</div>
          <div className="bg-gray-400">2</div>
          <div className="bg-gray-400">3</div>
          <div className="bg-gray-400">4</div>
          <div className="bg-gray-400">5</div>
          <div className="bg-gray-400">6</div>
          <div className="bg-gray-400">7</div>
          <div className="bg-gray-400">8</div>
          <div className="bg-gray-400">9</div>
          <div className="bg-gray-400">10</div>
        </div>
      </header>
      <div className="z-10 mx-auto grid h-screen max-w-[1085px] grid-cols-10 gap-[35px] text-center">
        <div className="bg-gray-200 pt-9">1</div>
        <div className="bg-gray-200 pt-9">2</div>

        <div className="col-span-6 bg-gray-200 pt-9">3-4-5-6-7-8</div>

        <div className="bg-gray-200 pt-9">9</div>
        <div className="bg-gray-200 pt-9">10</div>
      </div>
    </main>
  );
}
