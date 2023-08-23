//

import { type PropsWithChildren } from "react";

export function Card({
  children, // onSubmit,
  // "slot-InExchangeOf": slotInExchangeOf,
} // "slot-CategoryField": slotCategoryField,
: Props) {
  return (
    <div
      className="
        overflow-hidden
        rounded-xl
        bg-white
        text-black
        shadow-[5px_5px_10px_#7E7E7E33]
      "
    >
      <div className="p-6">{children}</div>
    </div>
  );
}

// export function Header({profile}: {profile: Profile}) {
//   return (
//     <header className="mb-4 flex justify-between">
//       <AvatarMediaHorizontal
//         u={profile.id}
//         university={profile.university}
//         username={profile.name}
//       />
//       <time
//         className="mt-3 text-xs"
//         dateTime={exchange.updatedAt.toUTCString()}
//         title={exchange.updatedAt.toUTCString()}
//       >
//         {exchange.updatedAt.toLocaleDateString("fr")}
//       </time>
//     </header>
//   );
// }
type Props = PropsWithChildren<{
  // onSubmit: FormikConfig<FormValues>["onSubmit"];
  // "slot-CategoryField": (props: FieldAttributes<any>) => React.ReactNode;
  // "slot-InExchangeOf": (props: FieldAttributes<any>) => React.ReactNode;
}>;
