import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Spotlight from "../ui/spotlight";

export default function Hero() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (event) => {
    const { clientX, clientY } = event;
    setMousePosition({ x: clientX, y: clientY });
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const floatingVariant = {
    initial: { y: 0, opacity: 0 },
    animate: {
      y: [0, -10, 0],
      opacity: 1,
      transition: {
        y: {
          duration: 3,
          ease: "easeInOut",
          repeat: Infinity,
        },
        opacity: {
          duration: 0.8,
          ease: "easeInOut",
        },
      },
    },
  };

  const [userQuery, setUserQuery] = useState("");

  return (
    <div className="flex flex-col gap-4 max-w-10xl h-[50vh] md:h-[75vh] size-screen mx-auto justify-center bg-green-50">
      <div className="relative z-10 hidden lg:block"></div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none bg-green-50">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute w-60 h-60 bg-gradient-to-br from-green-400 to-green-600 rounded-full mix-blend-multiply filter opacity-70 animate-floatA"></div>
            <div className="absolute top-[10rem] right-0 w-96 h-96 bg-gradient-to-br from-green-700 to-green-900 rounded-full mix-blend-multiply filter opacity-70 animate-floatB animation-delay-2000"></div>
          </div>
          <div className="absolute inset-0 bg-grid-green-100/[0.03] bg-[size:20px_20px]"></div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80"></div>
      </div>

      <motion.div
        animate={{ y: 0, opacity: 1 }}
        transition={{
          duration: 0.5,
          ease: "easeInOut",
          type: "spring",
          damping: 10,
          delay: 0.3,
        }}
        initial={{ y: -20, opacity: 0 }}
        className="relative z-10 max-w-7xl z-10 mx-auto px-4 flex flex-col gap-4 items-center justify-center"
      >
        <Spotlight fill="rgba(255, 255, 255, 0.2)" />
        <div className="flex flex-col items-center justify-center">
          <span className="tracking-tighter text-2xl md:text-3xl text-center font-medium text-green-700">
            Welcome to
          </span>
          <h1 className="tracking-tighter text-black max-sm:text-4xl text-6xl md:text-7xl xl:text-8xl text-center font-bold my-2">
            <span className="font-bold bg-gradient-to-b from-green-400 to-green-700 bg-clip-text text-transparent">
              Farm
            </span>
            Buddy.
          </h1>
        </div>
        <p className="text-green-600 max-w-lg text-center tracking-tight md:text-lg font-light">
          Your companion for all farming needs.
        </p>
      </motion.div>
    </div>
  );
}
