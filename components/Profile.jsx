import React from "react";
import { signOut, useSession } from "next-auth/react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
export default function Profile() {
  const { data: session } = useSession();
  return (
    <div
      onClick={() => signOut()}
      className="absolute z-20 top-5 right-8 flex items-center bg-black bg-opacity-70 text-white space-x-3 opacity-90 hover:opacity-80 cursor-pointer rounded-full p-1 pr-2"
    >
      <img
        className="rounded-full w-7 h-7"
        src={session?.user.image}
        alt="profile pic"
      />
      <p className="text-sm">Logout</p>
      <ChevronDownIcon className="h-5 w-5" />
    </div>
  );
}
