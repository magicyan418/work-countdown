"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface FlipCardProps {
  value: string
  isUrgent?: boolean
}

export function FlipCard({ value, isUrgent = false }: FlipCardProps) {
  const [flip, setFlip] = useState(false)
  const [currentValue, setCurrentValue] = useState(value)
  const [nextValue, setNextValue] = useState(value)
  const [bottomValue, setBottomValue] = useState(value)

  useEffect(() => {
    if (value === currentValue) return

    setNextValue(value)
    setFlip(true)

    const timeout = setTimeout(() => {
      setCurrentValue(value)
      setBottomValue(value)
      setFlip(false)
    }, 300) // Half of the transition time

    return () => clearTimeout(timeout)
  }, [value, currentValue])

  return (
    <div className="relative w-16 h-20 sm:w-20 sm:h-24 group">
      <div className="flip-card-inner w-full h-full relative">
        {/* Current Value (Top Half) */}
        <div
          className={cn(
            "absolute inset-0 h-1/2 overflow-hidden rounded-t-lg border-b border-gray-900 transition-all duration-300",
            isUrgent ? "bg-red-900/90 group-hover:bg-red-900" : "bg-gray-800/80 group-hover:bg-gray-800",
            "shadow-lg",
          )}
        >
          <div
            className="absolute inset-0 flex items-center justify-center text-3xl sm:text-4xl font-bold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
            style={{ top: 0, height: "200%" }}
          >
            {currentValue}
          </div>
        </div>

        {/* Current Value (Bottom Half) */}
        <div
          className={cn(
            "absolute inset-0 top-1/2 h-1/2 overflow-hidden rounded-b-lg transition-all duration-300",
            isUrgent ? "bg-red-800/90 group-hover:bg-red-800" : "bg-gray-700/80 group-hover:bg-gray-700",
            "shadow-lg",
          )}
        >
          <div
            className="absolute inset-0 flex items-center justify-center text-3xl sm:text-4xl font-bold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
            style={{ top: "-100%", height: "200%" }}
          >
            {bottomValue}
          </div>
        </div>

        {/* Flipping Top Half */}
        <div
          className={cn(
            "absolute inset-0 h-1/2 overflow-hidden rounded-t-lg border-b border-gray-900 backface-hidden transition-all duration-600",
            flip ? "rotate-x-90 origin-bottom" : "",
            isUrgent ? "bg-red-900/90 group-hover:bg-red-900" : "bg-gray-800/80 group-hover:bg-gray-800",
            "shadow-lg",
          )}
        >
          <div
            className="absolute inset-0 flex items-center justify-center text-3xl sm:text-4xl font-bold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
            style={{ top: 0, height: "200%" }}
          >
            {currentValue}
          </div>
        </div>

        {/* Next Value (Bottom Half) - 不再有翻转动画 */}
        <div
          className={cn(
            "absolute inset-0 top-1/2 h-1/2 overflow-hidden rounded-b-lg transition-all duration-300",
            isUrgent ? "bg-red-800/90 group-hover:bg-red-800" : "bg-gray-700/80 group-hover:bg-gray-700",
            "shadow-lg",
          )}
        >
          <div
            className="absolute inset-0 flex items-center justify-center text-3xl sm:text-4xl font-bold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
            style={{ top: "-100%", height: "200%" }}
          >
            {flip ? nextValue : bottomValue}
          </div>
        </div>
      </div>
    </div>
  )
}
