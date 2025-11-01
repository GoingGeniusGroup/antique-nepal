"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Leaf } from "lucide-react";

interface LoadingScreenProps {
  isLoading: boolean;
}

export function LoadingScreen({ isLoading }: LoadingScreenProps) {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-9999 bg-black flex items-center justify-center overflow-hidden"
        >
          {/* Mountainous background silhouette */}
          <div className="absolute inset-0 opacity-20">
            <svg
              className="w-full h-full"
              viewBox="0 0 1200 600"
              preserveAspectRatio="none"
            >
              <path
                d="M0,600 L0,400 L200,300 L400,350 L600,250 L800,320 L1000,280 L1200,350 L1200,600 Z"
                fill="currentColor"
                className="text-slate-700"
              />
              <path
                d="M0,600 L0,450 L150,380 L300,420 L450,340 L600,380 L750,320 L900,360 L1050,340 L1200,400 L1200,600 Z"
                fill="currentColor"
                className="text-slate-800"
              />
            </svg>
          </div>

          {/* Main content */}
          <div className="relative z-10 flex flex-col items-center justify-center space-y-8">
            {/* Flying leaf - wind animation */}
            <motion.div
              className="absolute"
              style={{
                top: "20%",
                left: "-5%",
              }}
              initial={{
                x: "-10vw",
                y: "50vh",
                rotate: -45,
                opacity: 0,
              }}
              animate={{
                x: [
                  "-10vw",
                  "25vw",
                  "50vw",
                  "75vw",
                  "110vw",
                ],
                y: [
                  "50vh",
                  "35vh",
                  "25vh",
                  "35vh",
                  "45vh",
                ],
                rotate: [
                  -45,
                  0,
                  45,
                  90,
                  180,
                  270,
                  360,
                  450,
                ],
                opacity: [0, 1, 1, 1, 0.5, 0],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Leaf
                className="w-12 h-12 text-emerald-400"
                style={{
                  filter: "drop-shadow(0 0 10px rgba(74, 222, 128, 0.6))",
                }}
              />
            </motion.div>

            {/* Small brand name */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <h1
                className="text-2xl md:text-3xl font-bold tracking-[0.15em] text-emerald-300"
                style={{ fontFamily: "var(--font-cinzel)" }}
              >
                ANTIQUE NEPAL
              </h1>
            </motion.div>

            {/* Dotted progress bar */}
            <motion.div
              className="flex items-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {Array.from({ length: 10 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 rounded-full bg-emerald-400/30"
                  animate={{
                    backgroundColor: [
                      "rgba(74, 222, 128, 0.3)",
                      "rgba(74, 222, 128, 1)",
                      "rgba(74, 222, 128, 0.3)",
                    ],
                    scale: [1, 1.3, 1],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.1,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
