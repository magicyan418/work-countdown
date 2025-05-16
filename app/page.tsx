"use client"

import { useState, useEffect } from "react"
import { Clock, Coffee, Home, Briefcase, PartyPopper } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import FlipCard from "@/components/flip-card"
import confetti from "canvas-confetti"

export default function WorkCountdown() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
    totalSeconds: 0,
  })
  const [workEndTime, setWorkEndTime] = useState("18:00")
  const [isEditing, setIsEditing] = useState(false)
  const [isWorkOver, setIsWorkOver] = useState(false)
  const [progress, setProgress] = useState(0)
  const { toast } = useToast()

  let hours, minutes // Declare hours and minutes here to avoid redeclaration errors

  // 计算剩余时间
  const calculateTimeLeft = () => {
    const now = new Date()
    ;[hours, minutes] = workEndTime.split(":").map(Number)

    const endTime = new Date(now)
    endTime.setHours(hours, minutes, 0, 0)

    // 如果已经过了下班时间，显示为0
    if (now >= endTime) {
      if (!isWorkOver) {
        setIsWorkOver(true)
        triggerConfetti()
        toast({
          title: "🎉 下班啦！",
          description: "是时候享受美好的下班时光了！",
        })
      }
      return { hours: 0, minutes: 0, seconds: 0, totalSeconds: 0 }
    }

    setIsWorkOver(false)

    const diff = Math.floor((endTime.getTime() - now.getTime()) / 1000)
    hours = Math.floor(diff / 3600)
    minutes = Math.floor((diff % 3600) / 60)
    const seconds = diff % 60

    return { hours, minutes, seconds, totalSeconds: diff }
  }

  // 计算工作日进度
  const calculateProgress = () => {
    const now = new Date()
    const [endHours, endMinutes] = workEndTime.split(":").map(Number)

    // 假设工作日从9:00开始
    const startTime = new Date(now)
    startTime.setHours(9, 0, 0, 0)

    const endTime = new Date(now)
    endTime.setHours(endHours, endMinutes, 0, 0)

    const totalWorkSeconds = (endTime.getTime() - startTime.getTime()) / 1000
    const elapsedSeconds = (now.getTime() - startTime.getTime()) / 1000

    if (elapsedSeconds <= 0) return 0
    if (elapsedSeconds >= totalWorkSeconds) return 100

    return Math.min(100, Math.max(0, Math.floor((elapsedSeconds / totalWorkSeconds) * 100)))
  }

  const [messageStyle, setMessageStyle] = useState<"poetic" | "motivational" | "zen" | "lazy" | "slacker">("poetic")

  // 根据剩余时间获取鼓励信息
  const getMotivationalMessage = () => {
    const { totalSeconds } = timeLeft

    const messages = {
      poetic: {
        over: "享受美好的下班时光吧！",
        s300: "归途在眼前，万物皆安。",
        s1800: "光影交错，劳作将歇。",
        s3600: "时光如歌，终章已近。",
        s7200: "半日已过，心绪渐轻。",
        default: "时钟缓缓转动，生活正悄然展开。"
      },
      motivational: {
        over: "下班不是终点，而是整装待发！",
        s300: "最后一搏，胜利就在前方！",
        s1800: "坚持半小时，你就是传说！",
        s3600: "冲刺阶段，不负今日！",
        s7200: "别停下，你已经超过了昨天的自己！",
        default: "每一滴汗水，都是明天的荣耀勋章！"
      },
      zen: {
        over: "一切随缘，下班即是解脱。",
        s300: "五分钟也是缘分，且行且珍惜。",
        s1800: "时间在流，我们在坐。",
        s3600: "一小时而已，何足挂怀。",
        s7200: "光阴如水，喝杯茶再说。",
        default: "上班也好，下班也罢，心静即安。"
      },
      lazy: {
        over: "结束了，能躺就躺，别想太多。",
        s300: "再撑会，等下就能摊着不动了。",
        s1800: "干完这段，今晚葛优躺安排上。",
        s3600: "硬撑一小时，不如偷个懒先躺会。",
        s7200: "撑住，休息才是正经事。",
        default: "躺不躺的无所谓，反正也不会多有劲。"
      },
      slacker: {
        over: "哦豁，下班了，躺平才是硬道理。",
        s300: "差不多了，装个样子就好。",
        s1800: "还有半小时，划划水混过去。",
        s3600: "一小时？不如刷会短视频冷静一下。",
        s7200: "反正也干不完，先发呆。",
        default: "能动手绝不动脑，能拖延就不着急。"
      }
    }

    const currentStyle = messages[messageStyle]

    if (isWorkOver) return currentStyle.over
    if (totalSeconds <= 300) return currentStyle.s300
    if (totalSeconds <= 1800) return currentStyle.s1800
    if (totalSeconds <= 3600) return currentStyle.s3600
    if (totalSeconds <= 7200) return currentStyle.s7200
    return currentStyle.default
  }

  const styleIcons = {
    poetic: "📜",
    motivational: "🔥",
    zen: "🧘‍♂️",
    lazy: "🛏",
    slacker: "🧟‍♂️"
  }

  const styleNames = {
    poetic: "诗意抽象",
    motivational: "励志燃魂",
    zen: "佛系洒脱",
    lazy: "躺平",
    slacker: "摆烂"
  }

  // 获取表情图标
  const getEmoji = () => {
    const { totalSeconds } = timeLeft

    if (isWorkOver) return "🎉"
    if (totalSeconds <= 300) return "🚀"
    if (totalSeconds <= 1800) return "⏳"
    if (totalSeconds <= 3600) return "☕"
    if (totalSeconds <= 7200) return "💪"
    return "📝"
  }

  // 触发庆祝彩花效果
  const triggerConfetti = () => {
    const duration = 3 * 1000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        return clearInterval(interval)
      }

      const particleCount = 50 * (timeLeft / duration)

      // 从左右两侧发射彩花
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      })
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      })
    }, 250)
  }

  // 更新时间
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
      setProgress(calculateProgress())
    }, 1000)

    return () => clearInterval(timer)
  }, [workEndTime])

  // 初始化
  useEffect(() => {
    setTimeLeft(calculateTimeLeft())
    setProgress(calculateProgress())
  }, [workEndTime])

  const [tempEndTime, setTempEndTime] = useState(workEndTime)

  // 处理下班时间变更
  const handleEndTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value
    setTempEndTime(newTime) // 修改这里，更新临时时间而不是直接更新workEndTime
  }

  // 处理确认时间变更
  const handleConfirmTime = () => {
    setWorkEndTime(tempEndTime)
    setIsEditing(false)
    toast({
      title: "⏰ 时间已更新",
      description: `下班时间已设置为 ${tempEndTime}`,
    })
  }

  // 在切换风格时添加提示
  const handleStyleChange = (style: "poetic" | "motivational" | "zen" | "lazy" | "slacker") => {
    setMessageStyle(style)
    toast({
      title: `${styleIcons[style]} 风格已切换`,
      description: `已切换至${styleNames[style]}风格`,
    })
  }

  // 格式化时间显示
  const formatTime = (value: number) => {
    return value.toString().padStart(2, "0")
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-purple-50 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            <span className="mr-2">{getEmoji()}</span>
            下班倒计时
          </CardTitle>
          <CardDescription>努力工作，快乐生活</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* 倒计时显示 */}
          <div className="flex justify-center space-x-4 text-center">
            <div className="flex flex-col">
              <FlipCard value={formatTime(timeLeft.hours)} />
              <span className="mt-2 text-sm">小时</span>
            </div>
            <div className="flex flex-col">
              <FlipCard value={formatTime(timeLeft.minutes)} />
              <span className="mt-2 text-sm">分钟</span>
            </div>
            <div className="flex flex-col">
              <FlipCard value={formatTime(timeLeft.seconds)} />
              <span className="mt-2 text-sm">秒</span>
            </div>
          </div>

          {/* 进度条 */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <div className="flex items-center">
                <Briefcase className="mr-1 h-4 w-4" />
                <span>工作中</span>
              </div>
              <div className="flex items-center">
                <Home className="mr-1 h-4 w-4" />
                <span>下班啦</span>
              </div>
            </div>
            <Progress value={progress} className="h-3" />
          </div>

          {/* 鼓励信息 */}
          <div className="space-y-2">
            <div className="flex justify-around space-x-2">
              <TooltipProvider>
                {Object.entries(styleIcons).map(([style, icon]) => (
                  <Tooltip key={style}>
                    <TooltipTrigger asChild>
                      <Button
                        size="sm"
                        variant={messageStyle === style ? "default" : "outline"}
                        onClick={() => handleStyleChange(style as typeof messageStyle)}
                      >
                        {icon}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{styleNames[style as keyof typeof styleNames]}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </TooltipProvider>
            </div>
            <div className="rounded-lg bg-blue-50 p-4 text-center">
              <p className="text-lg font-medium text-blue-800">{getMotivationalMessage()}</p>
            </div>
          </div>

          {/* 设置下班时间 */}
          <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
            <div className="flex items-center">
              <Clock className="mr-2 h-5 w-5 text-gray-600" />
              <span className="text-sm font-medium">下班时间:</span>
            </div>

            {isEditing ? (
              <div className="flex items-center space-x-2">
                <input
                  type="time"
                  value={tempEndTime}
                  onChange={handleEndTimeChange}
                  className="rounded border border-gray-300 px-2 py-1 text-sm"
                />
                <Button size="sm" variant="outline" onClick={handleConfirmTime}>
                  确定
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <span className="font-medium">{workEndTime}</span>
                <Button size="sm" variant="ghost" onClick={() => setIsEditing(true)}>
                  修改
                </Button>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex justify-center">
          {isWorkOver ? (
            <Button className="w-full gap-2" onClick={triggerConfetti}>
              <PartyPopper className="h-4 w-4" />
              再来一次庆祝！
            </Button>
          ) : (
            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={() => {
                toast({
                  title: "☕ 休息一下",
                  description: "短暂休息，提高工作效率！",
                })
              }}
            >
              <Coffee className="h-4 w-4" />
              休息一下
            </Button>
          )}
        </CardFooter>
      </Card>
      <Toaster /> {/* 添加 Toaster 组件 */}
    </div>
  )
}

// 在文件顶部添加 Tooltip 相关组件的导入
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// 在文件顶部添加 Toaster 组件的导入
import { Toaster } from "@/components/ui/toaster"
