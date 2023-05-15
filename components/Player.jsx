import { PauseCircleIcon, PlayCircleIcon } from "@heroicons/react/24/solid";
import { ForwardIcon, BackwardIcon } from "@heroicons/react/24/outline";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

const Player = ({
  globalCurrentSongId,
  setGlobalCurrentSongId,
  globalIsTrackPlaying,
  setGlobalIsTrackPlaying
}) => {
  const { data: session } = useSession();
  const [songInfo, setSongInfo] = useState(null);

  async function getDeviceId() {
    if (session && session.accessToken) {
      const response = await fetch(
        `https://api.spotify.com/v1/me/player/devices`,
        {
          headers: {
            Authorization: `Bearer ${session.accessToken}`
          }
        }
      );
      const data = await response.json();
      const deviceID = data.devices[0].id;
      return deviceID;
    }
  }

  async function fetchSongInfo(trackId) {
    if (trackId) {
      const response = await fetch(
        `https://api.spotify.com/v1/tracks/${trackId}`,
        {
          headers: {
            Authorization: `Bearer ${session.accessToken}`
          }
        }
      );
      const data = await response.json();
      setSongInfo(data);
    }
  }

  async function getCurrentlyPlaying() {
    const response = await fetch(
      "https://api.spotify.com/v1/me/player/currently-playing",
      {
        headers: {
          Authorization: `Bearer ${session.accessToken}`
        }
      }
    );
    if (response.status == 204) {
      console.log("204 response from currently playing");
      return;
    }
    const data = await response.json();
    return data;
  }

  async function handleSkip(e) {
    const deviceID = await getDeviceId();

    if (e === "forward") {
      const response = await fetch(
        `https://api.spotify.com/v1/me/player/next?device_id=${deviceID}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session.accessToken}`
          }
        }
      );

      console.log("on Next", response.status);
      const data = await getCurrentlyPlaying();
      setGlobalCurrentSongId(data.item.id);
      setGlobalIsTrackPlaying(true);
    } else {
      const response = await fetch(
        `https://api.spotify.com/v1/me/player/previous?device_id=${deviceID}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session.accessToken}`
          }
        }
      );

      console.log("on previous", response.status);
      const data = await getCurrentlyPlaying();
      setGlobalCurrentSongId(data.item.id);
      setGlobalIsTrackPlaying(true);
    }
  }

  async function handlePlayPause() {
    if (session && session.accessToken) {
      const data = await getCurrentlyPlaying();
      if (data?.is_playing) {
        const response = await fetch(
          "https://api.spotify.com/v1/me/player/pause",
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${session.accessToken}`
            }
          }
        );
        if (response.status == 204) {
          setGlobalIsTrackPlaying(false);
        }
      } else {
        const response = await fetch(
          "https://api.spotify.com/v1/me/player/play",
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${session.accessToken}`
            }
          }
        );
        if (response.status == 204) {
          setGlobalIsTrackPlaying(true);
          setGlobalCurrentSongId(data.item.id);
        }
      }
    }
  }

  useEffect(() => {
    // fetch song details and play song
    async function f() {
      if (session && session.accessToken) {
        if (!globalCurrentSongId) {
          // get the currently playing song from spotify
          const data = await getCurrentlyPlaying();
          setGlobalCurrentSongId(data?.item?.id);
          if (data.is_playing) {
            setGlobalIsTrackPlaying(true);
          }
          await fetchSongInfo(data?.item?.id);
        } else {
          // get song info
          await fetchSongInfo(globalCurrentSongId);
        }
      }
    }
    f();
  }, [globalCurrentSongId]);

  return (
    <div className="h-24 bg-neutral-800 border-t border-neutral-700 text-white grid grid-cols-3 text-xs md:text-base px-2 md:px-8">
      <div className="flex items-center space-x-4">
        {songInfo?.album.images[0].url && (
          <img
            className="hidden md:inline h-10 w-10"
            src={songInfo.album.images[0].url}
          />
        )}
        <div>
          <p className="text-white text-sm">{songInfo?.name}</p>
          <p className="text-neutral-400 text-xs">
            {songInfo?.artists[0]?.name}
          </p>
        </div>
      </div>
      <div className="flex items-center justify-center">
        <BackwardIcon
          onClick={async () => await handleSkip("backward")}
          name="backword"
          className="h-6 w-6 transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
        />
        {globalIsTrackPlaying ? (
          <PauseCircleIcon onClick={handlePlayPause} className="h-10 w-10" />
        ) : (
          <PlayCircleIcon onClick={handlePlayPause} className="h-10 w-10" />
        )}
        <ForwardIcon
          onClick={async () => await handleSkip("forward")}
          className="h-6 w-6 "
          name="forward"
        />
      </div>
      <div></div>
    </div>
  );
};

export default Player;
