'use client'

import { useEffect, useState, useRef } from 'react'

interface FlipCardProps {
  value: string
  isUrgent?: boolean
}

const FlipCard = ({ value, isUrgent = false }: FlipCardProps) => {
  const [currentNumber, setCurrentNumber] = useState(value)
  const [nextNumber, setNextNumber] = useState(value)
  const [isFlipping, setIsFlipping] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (value !== currentNumber) {
      setNextNumber(value)
      setIsFlipping(true)
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      
      timeoutRef.current = setTimeout(() => {
        setCurrentNumber(value)
        setIsFlipping(false)
      }, 600)
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [value, currentNumber])

  return (
    <section className={`
      relative w-[1.6em] h-[2em] text-center text-[40px] font-bold text-white [perspective:8em]
      ${isUrgent ? 'animate-pulse' : ''}
    `}>
      {/* 静态上半部分 */}
      <div className={`
        absolute inset-x-0 h-1/2 overflow-hidden
        ${isUrgent ? 'bg-red-900/90' : 'bg-neutral-700'} 
        top-0 rounded-t-[4px]
      `}>
        <div className="h-[2em] leading-[2em] translate-y-[0.05em]">
          {isFlipping ? nextNumber : currentNumber}
        </div>
      </div>
      
      {/* 静态下半部分 */}
      <div className={`
        absolute inset-x-0 h-1/2 overflow-hidden
        ${isUrgent ? 'bg-red-800/90' : 'bg-neutral-600'} 
        bottom-0 rounded-b-[4px]
      `}>
        <div className="h-[2em] leading-[2em] -translate-y-[0.95em]">
          {currentNumber}
        </div>
      </div>
      
      {/* 翻转上半部分 */}
      <div className={`
        absolute inset-x-0 h-1/2 overflow-hidden transition-all duration-600 linear 
        ${isUrgent ? 'bg-red-900/90' : 'bg-neutral-700'} 
        top-0 rounded-t-[4px] origin-[0_100%]
        ${isFlipping ? 'animate-[up-move_700ms_linear_forwards] z-20' : 'opacity-0'}
      `}>
        <div className="h-[2em] leading-[2em] translate-y-[0.05em]">
          {nextNumber}
        </div>
      </div>
      
      {/* 翻转下半部分 */}
      <div className={`
        absolute inset-x-0 h-1/2 overflow-hidden transition-all duration-600 linear 
        ${isUrgent ? 'bg-red-800/90' : 'bg-neutral-600'} 
        bottom-0 rounded-b-[4px] origin-[0_0]
        ${isFlipping ? 'animate-[down-move_700ms_linear_forwards] z-20' : 'opacity-0'}
      `}>
        <div className="h-[2em] leading-[2em] -translate-y-[0.95em]">
          {nextNumber}
        </div>
      </div>
    </section>
  )
}

export default FlipCard