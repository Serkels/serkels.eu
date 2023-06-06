//

export default function Page() {
  return (
    <main>
      <footer className="fixed bottom-0 right-0 bg-white text-red-500 opacity-50">
        10 Columns
      </footer>

      <div className="mx-auto grid h-screen max-w-[1085px] grid-cols-10 gap-[35px] text-center">
        <div className="bg-gray-200 pt-6">1</div>
        <div className="bg-gray-200 pt-6">2</div>
        <div className="bg-gray-200 pt-6">3</div>
        <div className="bg-gray-200 pt-6">4</div>
        <div className="bg-gray-200 pt-6">5</div>
        <div className="bg-gray-200 pt-6">6</div>
        <div className="bg-gray-200 pt-6">7</div>
        <div className="bg-gray-200 pt-6">8</div>
        <div className="bg-gray-200 pt-6">9</div>
        <div className="bg-gray-200 pt-6">10</div>
      </div>
    </main>
  );
}
