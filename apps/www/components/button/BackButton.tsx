"use client";

import Image from "next/image";
import Link from "next/link";

function BackButton({ href }: { href: string }) {
  return (
    <Link href={href}>
      <Image src="/back.svg" alt="back" width={20} height={20} priority />
    </Link>
  );
}

export default BackButton;
