import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main
      className={inter.className}
      un-flex="~ col justify-between items-center"
      un-item="center"
      un-min-h="screen"
    >
      <div un-flex="~ auto justify-center items-center" un-text="6xl">
        Toc - Toc
      </div>
    </main>
  );
}
