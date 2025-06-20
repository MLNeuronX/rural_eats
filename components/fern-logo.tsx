"use client"

import { motion } from "framer-motion"

interface FernLogoProps {
  size?: "sm" | "md" | "lg"
  className?: string
  animated?: boolean
}

export function FernLogo({ size = "md", className = "", animated = false }: FernLogoProps) {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  }

  const leafVariants = {
    initial: { scale: 0, rotate: -10 },
    animate: { scale: 1, rotate: 0 },
    hover: { scale: 1.1, rotate: 5 },
  }

  return (
    <motion.div
      className={`${sizeClasses[size]} ${className} relative`}
      initial={animated ? "initial" : "animate"}
      animate="animate"
      whileHover={animated ? "hover" : undefined}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* Main stem */}
        <motion.path
          d="M16 28 L16 4"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          variants={leafVariants}
          transition={{ delay: 0.1 }}
        />

        {/* Left fronds */}
        <motion.path
          d="M16 8 Q12 6 8 8 Q10 10 12 12 Q14 10 16 12"
          fill="currentColor"
          opacity="0.8"
          variants={leafVariants}
          transition={{ delay: 0.2 }}
        />

        <motion.path
          d="M16 14 Q11 12 6 14 Q8 16 10 18 Q13 16 16 18"
          fill="currentColor"
          opacity="0.7"
          variants={leafVariants}
          transition={{ delay: 0.3 }}
        />

        <motion.path
          d="M16 20 Q10 18 4 20 Q6 22 8 24 Q12 22 16 24"
          fill="currentColor"
          opacity="0.6"
          variants={leafVariants}
          transition={{ delay: 0.4 }}
        />

        {/* Right fronds */}
        <motion.path
          d="M16 8 Q20 6 24 8 Q22 10 20 12 Q18 10 16 12"
          fill="currentColor"
          opacity="0.8"
          variants={leafVariants}
          transition={{ delay: 0.2 }}
        />

        <motion.path
          d="M16 14 Q21 12 26 14 Q24 16 22 18 Q19 16 16 18"
          fill="currentColor"
          opacity="0.7"
          variants={leafVariants}
          transition={{ delay: 0.3 }}
        />

        <motion.path
          d="M16 20 Q22 18 28 20 Q26 22 24 24 Q20 22 16 24"
          fill="currentColor"
          opacity="0.6"
          variants={leafVariants}
          transition={{ delay: 0.4 }}
        />
      </svg>
    </motion.div>
  )
}
