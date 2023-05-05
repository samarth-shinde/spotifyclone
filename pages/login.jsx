import { signIn, useEffect, useRef } from "next-auth/react";

const Login = () => {
  return (
    <div
      style={{ zIndex: -1 }}
      className="w-screen h-screen flex items-center justify-center"
    >
      <video
        src={require("../public/video.mp4")}
        playsInline
        autoPlay
        muted
        loop
        className="w-full justify-center fixed z-[-1]"
      ></video>
      <button
        className="text-white px-8 py-2 rounded-full bg-green-700 text-lg"
        onClick={() => signIn("spotify", { callbackUrl: "/" })}
      >
        Login with spotify
      </button>
    </div>
  );
};

export default Login;
