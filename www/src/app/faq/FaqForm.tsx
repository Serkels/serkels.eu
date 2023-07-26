"use client";

import { Avatar } from "@/components/Avatar";

//

export function FaqForm() {
  return (
    <div
      className="
      flex items-center
      space-x-7 
      overflow-hidden 
      rounded-xl
      bg-white 
      p-6
      text-black 
      shadow-[5px_5px_10px_#7E7E7E33]
      "
    >
      <Avatar className="h-10" />
      <input
        type="text"
        className="
          w-full 
          rounded-sm border border-solid border-[#dddddd] 
          px-4 py-3
          
          placeholder-black
          
          md:col-span-6
        "
        placeholder="Pose une questions aux étudiants ..."
      />
    </div>
  );
}
