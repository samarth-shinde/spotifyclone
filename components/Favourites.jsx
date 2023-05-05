import { useSession } from "next-auth/react";
import React, { useState, useEffect } from "react";
import Song from "./Song";
import Profile from "./Profile";
export default function Favourites() {
  const { data: session } = useSession();
  const [favourites, setFavourites] = useState([]);
  //   const [opacity, setOpacity] = useState(0);
  //   const [textOpacity, setTextOpacity] = useState(0);
  //   function changeOpacity(scrollPos) {
  //     // scrollPos = 0 -> opacity = 0
  //     // scrollPos = 300 -> opacity = 1, textOpacity = 0
  //     // scrollPos = 310 -> opacity = 1, textOpacity = 1
  //     const offset = 300;
  //     const textOffset = 10;
  //     if (scrollPos < offset) {
  //       const newOpacity = 1 - (offset - scrollPos) / offset;
  //       setOpacity(newOpacity);
  //       setTextOpacity(0);
  //     } else {
  //       setOpacity(1);
  //       const delta = scrollPos - offset;
  //       const newTextOpacity = 1 - (textOffset - delta) / textOffset;
  //       setTextOpacity(newTextOpacity);
  //     }
  //   }

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
        console.log(data.items);
        setFavourites(data.items);
      }
    }
    f();
  }, [session]);

  return (
    <div>
      <Profile />
      <div
        onScroll={(e) => changeOpacity(e.target.scrollTop)}
        className="relative -top-20 h-screen overflow-y-scroll bg-neutral-900"
      >
        <div className="text-white px-8 flex flex-col space-y-1 pb-28">
          {favourites?.items?.map((track, i) => {
            // song component
            console.log(track);
            return (
              <Song
                setView={setView}
                setGlobalArtistId={setGlobalArtistId}
                setGlobalIsTrackPlaying={setGlobalIsTrackPlaying}
                setGlobalCurrentSongId={setGlobalCurrentSongId}
                key={track.track.id}
                sno={i}
                track={track.track}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
