//

import type { Profile } from "@1.modules/profile.domain";
import { Avatar } from "@1.modules/profile.ui/avatar";

export function Idle({
  profile,
  onClick,
}: {
  profile?: Profile;
  onClick?: () => void;
}) {
  if (!profile) return null;
  return (
    <div className="flex space-x-3 overflow-hidden rounded-xl bg-white p-6 text-black shadow-[5px_5px_10px_#7E7E7E33]">
      <Avatar className="h-10" profile={profile} />
      <button
        className="w-full rounded-sm border border-solid border-[#dddddd] px-4 py-2 text-left hover:bg-gray-200"
        onClick={onClick}
      >
        Pose une question aux étudiant.e.s ...
      </button>
    </div>
  );
}
