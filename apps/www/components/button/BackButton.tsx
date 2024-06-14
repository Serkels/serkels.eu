"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

function BackButton() {
  const router = useRouter();

  return (
    <button type="button" onClick={() => router.back()}>
      <Image src="/back.svg" alt="back" width={20} height={20} priority></Image>
    </button>
  );
}

export default BackButton;
