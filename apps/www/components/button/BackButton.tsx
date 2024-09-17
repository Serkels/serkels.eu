"use client";

import { sendGAEvent } from "@next/third-parties/google";
import Image from "next/image";
import Link from "next/link";

function BackButton({ href }: { href: string }) {
  return (
    <Link
      className="justify-self-start md:hidden"
      href={href}
      onClick={() => {
        sendGAEvent({
          event: "back_button",
          value: href,
        });
      }}
    >
      <Image src="/back.svg" alt="back" width={20} height={20} priority />
    </Link>
  );
}

export default BackButton;
