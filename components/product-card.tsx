"use client";

import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Sparkles } from "lucide-react";
import { useState } from "react";

type Props = {
  title: string;
  price: string;
  img: string;
  tag?: string;
  description?: string;
};

export function ProductCard({ title, price, img, tag, description }: Props) {
  const [isHovered, setIsHovered] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7.5deg", "-7.5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7.5deg", "7.5deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  return (
    <motion.div 
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      whileHover={{ z: 50 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group perspective-1000 scale-90 sm:scale-100"
    >
      <Card className={"relative overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 p-0 border border-[#e0d5c7] bg-white hover:border-emerald-500/50 dark:border-white/10 dark:bg-linear-to-br dark:from-[#1f1f1f] dark:to-[#2a2a2a] dark:hover:shadow-emerald-500/10 dark:hover:border-emerald-500/30"} style={{ transformStyle: "preserve-3d" }}>
        {/* Shimmer effect */}
        <motion.div
          className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent"
          animate={isHovered ? { x: ["-100%", "200%"] } : {}}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          style={{ transform: "translateZ(1px)" }}
        />
        
        <div className={"relative aspect-square overflow-hidden rounded-t-xl bg-[#f5f0ea] dark:bg-black/40"}>
          <motion.div
            animate={isHovered ? { scale: 1.15 } : { scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full h-full"
          >
            <Image 
              src={img} 
              alt={title} 
              fill 
              className="object-cover" 
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 33vw"
            />
          </motion.div>
          {tag && (
            <motion.div 
              className="absolute left-4 top-4 rounded-full bg-linear-to-r from-emerald-500 to-emerald-600 text-white text-xs font-medium px-3 py-1 shadow-lg shadow-emerald-500/30 flex items-center gap-1"
              animate={isHovered ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 0.5 }}
            >
              <Sparkles className="h-3 w-3" />
              {tag}
            </motion.div>
          )}
        </div>
        <CardContent className="p-4 sm:p-6" style={{ transform: "translateZ(20px)" }}>
          <h3 className={"text-base sm:text-lg font-semibold mb-1 text-[#2d2520] dark:text-white"}>{title}</h3>
          <p className={"text-xs sm:text-sm mb-3 sm:mb-4 text-neutral-600 dark:text-neutral-400"}>{description || "Handwoven with traditional patterns"}</p>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
            <motion.div 
              className={"text-lg sm:text-xl font-bold text-[#2d2520] dark:text-emerald-400"}
              animate={isHovered ? { scale: 1.1 } : { scale: 1 }}
            >
              Rs. {price}
            </motion.div>
            <motion.button 
              className={"group/btn relative overflow-hidden inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-all duration-300 w-full sm:w-auto justify-center text-[#c85a3c] bg-white border border-[#c85a3c] hover:bg-[#c85a3c] hover:text-white dark:text-emerald-400 dark:bg-emerald-500/10 dark:border dark:border-emerald-500/30 dark:hover:bg-emerald-500 dark:hover:text-white"}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className={"absolute inset-0 bg-[#c85a3c] dark:bg-emerald-500"}
                initial={{ x: "-100%" }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
              <span className="relative z-10">View Details</span>
              <ArrowRight className="relative z-10 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
            </motion.button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}


