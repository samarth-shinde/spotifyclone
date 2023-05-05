import { useSession } from "next-auth/react";
import React, { useState, useEffect } from "react";
import Song from "./Song";
import Profile from "./Profile";
import { HeartIcon } from "@heroicons/react/24/solid";
export default function Favourites({
  setView,
  setGlobalArtistId,
  setGlobalIsTrackPlaying,
  setGlobalCurrentSongId
}) {
  const { data: session } = useSession();
  const [favourites, setFavourites] = useState([]);

  useEffect(() => {
    async function f() {
      if (session && session.accessToken) {
        console.log(session);
        const response = await fetch(
          `https://api.spotify.com/v1/me/top/tracks`,
          {
            headers: {
              Authorization: `Bearer ${session.accessToken}`
            }
          }
        );
        const data = await response.json();
        setFavourites(data.items);
      }
    }
    f();
  }, [session]);

  return (
    <div className=" flex-col items-center justify-center h-screen">
      <Profile />
      <section
        className={`flex items-end space-x-7 bg-gradient-to-b from-purple-500 to-purple-1200 h-70 text-white p-8`}
      >
        <HeartIcon className="w-12 h-12" />

        <div>
          <h1 className="text-2xl md:text-3xl lg:text-5xl font-extrabold">
            Liked Songs
          </h1>
        </div>
      </section>
      <div className="relative-top-20 h-screen overflow-y-scroll w-screen bg-neutral-900">
        <div className="text-white px-8 flex flex-col space-y-1 pb-28">
          {favourites?.map((track, i) => (
            // song component

            <Song
              setView={setView}
              setGlobalArtistId={setGlobalArtistId}
              setGlobalIsTrackPlaying={setGlobalIsTrackPlaying}
              setGlobalCurrentSongId={setGlobalCurrentSongId}
              key={track.id}
              sno={i}
              track={track}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
