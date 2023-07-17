import React from 'react';
import { motion } from "framer-motion"

function Loading() {
  return (
    <>
    <div className="flex-auto flex-column h-screen content-center items-center justify-center">
        <motion.div style={{width: "150px", height: "150px", background: "#444"}} 
            animate={{
                scale: [1, 2, 2, 1, 1],
                rotate: [0, 0, 180, 180, 0],
                borderRadius: ["0%", "0%", "50%", "50%", "0%"]
            }}
            transition={{
                duration: 2,
                ease: "easeInOut",
                times: [0, 0.2, 0.5, 0.8, 1],
                repeat: Infinity,
                repeatDelay: 1
            }} />
    </div>
  </>
  )
}

export default Loading;