//

// import { UserAvatarFilled } from "@1.ui/react/icons";
import { SignUpForm } from "@1.modules/auth.next/components/SignUpForm";
import type { Metadata, ResolvingMetadata } from "next";

//

export async function generateMetadata(
  _: never,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  return {
    title: `Student :: ${(await parent).title?.absolute}`,
  };
}

//

export default async function Page() {
  return (
    <main className="container mx-auto my-10 flex max-w-4xl flex-col justify-center">
      <SignUpForm />
    </main>
  );
}
