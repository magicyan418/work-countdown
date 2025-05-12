"use client"

import { useState, useEffect } from "react"
import { Clock, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { FlipCard } from "@/components/flip-card"
import { ProgressScene } from "@/components/progress-scene"
import { cn } from "@/lib/utils"

export default function Home() {
  const [endTime, setEndTime] = useState("18:00")
  const [tempEndTime, setTempEndTime] = useState(endTime)  // 添加临时状态存储选择的时间
  const [countdown, setCountdown] = useState({ hours: 0, minutes: 0, seconds: 0 })
  const [progress, setProgress] = useState(0)
  const [isWorkDay, setIsWorkDay] = useState(true)
  const [isUrgent, setIsUrgent] = useState(false)

  // Calculate time remaining until end time
  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date()
      const [hours, minutes] = endTime.split(":").map(Number)

      const endTimeDate = new Date(now)
      endTimeDate.setHours(hours, minutes, 0, 0)

      // If end time has passed for today, show 0
      if (now > endTimeDate) {
        setIsWorkDay(false)
        setCountdown({ hours: 0, minutes: 0, seconds: 0 })
        setProgress(100)
        return
      }

      setIsWorkDay(true)

      // Calculate time difference in milliseconds
      const diff = endTimeDate.getTime() - now.getTime()

      // 检查是否在下班前三分钟内
      const isWithinThreeMinutes = diff <= 3 * 60 * 1000 && diff > 0
      setIsUrgent(isWithinThreeMinutes)

      // Convert to hours, minutes, seconds
      const hoursRemaining = Math.floor(diff / (1000 * 60 * 60))
      const minutesRemaining = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const secondsRemaining = Math.floor((diff % (1000 * 60)) / 1000)

      setCountdown({
        hours: hoursRemaining,
        minutes: minutesRemaining,
        seconds: secondsRemaining,
      })

      // Calculate progress (assuming 8-hour workday starting 8 hours before end time)
      const workdayStart = new Date(endTimeDate)
      workdayStart.setHours(workdayStart.getHours() - 8)

      const totalWorkdayMs = endTimeDate.getTime() - workdayStart.getTime()
      const elapsedMs = now.getTime() - workdayStart.getTime()

      const calculatedProgress = Math.min(100, Math.max(0, (elapsedMs / totalWorkdayMs) * 100))
      // 保留两位小数的进度值
      setProgress(Number.parseFloat(calculatedProgress.toFixed(2)))
    }

    calculateTimeRemaining()
    const interval = setInterval(calculateTimeRemaining, 1000)

    return () => clearInterval(interval)
  }, [endTime])

  // Format numbers to always have two digits
  const formatNumber = (num: number) => num.toString().padStart(2, "0")

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* 背景场景 */}
      <ProgressScene progress={progress} />

      {/* 主要内容 */}
      <div
        className={cn(
          "relative z-10 w-full max-w-md flex flex-col items-center gap-8 p-6 rounded-xl transition-all duration-300",
          "bg-black/10 backdrop-blur-[2px] hover:backdrop-blur-md hover:bg-black/40",
          "group",
          isUrgent && "animate-pulse shadow-[0_0_15px_5px_rgba(239,68,68,0.7)]",
        )}
      >
        <h1
          className={cn(
            "text-3xl font-bold text-center transition-all duration-300",
            "text-white/90 group-hover:text-white drop-shadow-[0_2px_3px_rgba(0,0,0,0.5)]",
            isUrgent && "text-red-400 animate-bounce",
          )}
        >
          下班倒计时
        </h1>

        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="gap-2 bg-white/20 hover:bg-white/40 backdrop-blur-sm transition-all duration-300 shadow-md"
            >
              <Settings size={16} />
              设置下班时间
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>设置下班时间</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="end-time">下班时间</Label>
                <Input 
                  id="end-time" 
                  type="time" 
                  value={tempEndTime} 
                  onChange={(e) => setTempEndTime(e.target.value)} 
                />
              </div>
            </div>
            <Button onClick={() => {
              setEndTime(tempEndTime);  // 点击保存时才应用新的时间
              const closeButton = document.querySelector('button[aria-label="Close"]') as HTMLButtonElement;
              closeButton?.click();
            }}>保存</Button>
          </DialogContent>
        </Dialog>

        <div className="relative w-full">
          <div className="flex items-center gap-2 text-2xl mb-4 transition-all duration-300 text-white/90 group-hover:text-white drop-shadow-[0_2px_3px_rgba(0,0,0,0.5)]">
            <Clock size={24} className={cn("text-yellow-400", isUrgent && "text-red-400")} />
            <span>下班时间: {endTime}</span>
          </div>

          <div className="flex gap-1 sm:gap-2 justify-center">
            <div className="flex flex-col items-center">
              <FlipCard value={formatNumber(countdown.hours)} isUrgent={isUrgent} />
              <span className="text-xs mt-1 text-gray-200">小时</span>
            </div>
            <div className="text-4xl font-bold flex items-center justify-center pb-6 text-white">:</div>
            <div className="flex flex-col items-center">
              <FlipCard value={formatNumber(countdown.minutes)} isUrgent={isUrgent} />
              <span className="text-xs mt-1 text-gray-200">分钟</span>
            </div>
            <div className="text-4xl font-bold flex items-center justify-center pb-6 text-white">:</div>
            <div className="flex flex-col items-center">
              <FlipCard value={formatNumber(countdown.seconds)} isUrgent={isUrgent} />
              <span className="text-xs mt-1 text-gray-200">秒</span>
            </div>
          </div>

          {isWorkDay ? (
            <div className="w-full text-center mt-6">
              <p
                className={cn(
                  "text-lg mb-2 transition-all duration-300",
                  "text-white/90 group-hover:text-white drop-shadow-[0_2px_3px_rgba(0,0,0,0.5)]",
                  isUrgent && "text-red-300 font-bold text-xl",
                )}
              >
                {isUrgent
                  ? "马上就要下班啦！准备收拾东西吧！🎉"
                  : progress < 25
                    ? "坚持住，才刚开始！"
                    : progress < 50
                      ? "已经完成了四分之一！"
                      : progress < 75
                        ? "过半了，继续加油！"
                        : progress < 90
                          ? "即将解放，冲刺阶段！"
                          : "马上就可以下班了！"}
              </p>
              <p
                className={cn(
                  "text-sm mb-1 text-right transition-all duration-300",
                  "text-white/80 group-hover:text-white",
                  isUrgent && "text-red-200",
                )}
              >
                进度: {progress.toFixed(2)}%
              </p>
              <div className="w-full h-4 bg-gray-700/30 group-hover:bg-gray-700/50 rounded-full overflow-hidden backdrop-blur-sm transition-all duration-300">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-1000 ease-out",
                    isUrgent && "animate-pulse",
                  )}
                  style={{
                    width: `${progress}%`,
                    background: `linear-gradient(90deg, 
                      ${progress < 30 ? "#3b82f6" : progress < 60 ? "#10b981" : progress < 90 ? "#f59e0b" : "#ef4444"}
                      , 
                      ${progress < 30 ? "#60a5fa" : progress < 60 ? "#34d399" : progress < 90 ? "#fbbf24" : "#f87171"}
                    )`,
                  }}
                />
              </div>
            </div>
          ) : (
            <p className="text-xl font-bold text-green-400/90 group-hover:text-green-400 mt-6 drop-shadow-[0_2px_3px_rgba(0,0,0,0.5)] transition-all duration-300">
              已经下班啦！享受美好的下班时光吧！
            </p>
          )}
        </div>
      </div>
    </main>
  )
}
