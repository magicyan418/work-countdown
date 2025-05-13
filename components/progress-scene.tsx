"use client"

import { useEffect, useRef } from "react"

interface ProgressSceneProps {
  progress: number
}

export function ProgressScene({ progress }: ProgressSceneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      const dpr = window.devicePixelRatio || 1
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      ctx.scale(dpr, dpr)
    }

    setCanvasDimensions()
    window.addEventListener("resize", setCanvasDimensions)
    console.log("canvas", canvas)
    // Animation variables
    const draw = () => {
      const width = canvas.width / window.devicePixelRatio
      const height = canvas.height / window.devicePixelRatio

      // Clear canvas
      ctx.clearRect(0, 0, width, height)

      // Draw office scene
      drawOfficeScene(ctx, width, height, progress)

      // Request next frame
      requestAnimationFrame(draw)
    }

    // Start animation
    draw()

    return () => {
      window.removeEventListener("resize", setCanvasDimensions)
    }
  }, [progress])

  return (
    <div className="absolute inset-0 w-full h-full transition-all duration-300 group-hover:blur-sm">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  )
}

function drawOfficeScene(ctx: CanvasRenderingContext2D, width: number, height: number, progress: number) {
  // 计算是否在下班前三分钟内
  const isUrgent = progress >= 90 && progress < 100

  // 背景 - 从早晨到傍晚变化
  const skyGradient = ctx.createLinearGradient(0, 0, 0, height)

  if (progress < 25) {
    // 早晨 - 明亮的蓝色
    skyGradient.addColorStop(0, "#1e88e5")
    skyGradient.addColorStop(1, "#90caf9")
  } else if (progress < 50) {
    // 中午 - 明亮的蓝色
    skyGradient.addColorStop(0, "#1565c0")
    skyGradient.addColorStop(1, "#42a5f5")
  } else if (progress < 75) {
    // 下午 - 带橙色调
    skyGradient.addColorStop(0, "#0d47a1")
    skyGradient.addColorStop(1, "#ffb74d")
  } else {
    // 傍晚 - 日落颜色
    skyGradient.addColorStop(0, "#0a2472")
    skyGradient.addColorStop(1, isUrgent ? "#d84315" : "#ef6c00")
  }

  ctx.fillStyle = skyGradient
  ctx.fillRect(0, 0, width, height)

  // 添加云朵
  drawClouds(ctx, width, height, progress)

  // 太阳/月亮位置基于进度
  const celestialX = width * (progress / 100)
  const celestialY = height * 0.3 * Math.sin(Math.PI * (progress / 100)) + height * 0.2

  if (progress < 75) {
    // 太阳
    const sunGlow = ctx.createRadialGradient(celestialX, celestialY, 0, celestialX, celestialY, 30)
    sunGlow.addColorStop(0, "rgba(255, 255, 0, 0.8)")
    sunGlow.addColorStop(1, "rgba(255, 255, 0, 0)")

    ctx.fillStyle = sunGlow
    ctx.beginPath()
    ctx.arc(celestialX, celestialY, 30, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = "#ffeb3b"
    ctx.beginPath()
    ctx.arc(celestialX, celestialY, 15, 0, Math.PI * 2)
    ctx.fill()
  } else {
    // 月亮
    ctx.fillStyle = "#f5f5f5"
    ctx.beginPath()
    ctx.arc(celestialX, celestialY, 15, 0, Math.PI * 2)
    ctx.fill()

    // 月球陨石坑
    ctx.fillStyle = "#e0e0e0"
    ctx.beginPath()
    ctx.arc(celestialX - 5, celestialY - 5, 3, 0, Math.PI * 2)
    ctx.fill()

    ctx.beginPath()
    ctx.arc(celestialX + 7, celestialY + 2, 4, 0, Math.PI * 2)
    ctx.fill()
  }

  // 地面
  const groundGradient = ctx.createLinearGradient(0, height * 0.7, 0, height)
  groundGradient.addColorStop(0, "#4caf50")
  groundGradient.addColorStop(1, "#2e7d32")
  ctx.fillStyle = groundGradient
  ctx.fillRect(0, height * 0.7, width, height * 0.3)

  // 道路
  ctx.fillStyle = "#607d8b"
  ctx.fillRect(width * 0.4, height * 0.7, width * 0.2, height * 0.3)

  // 道路标记
  ctx.strokeStyle = "#fff"
  ctx.setLineDash([width * 0.02, width * 0.02])
  ctx.beginPath()
  ctx.moveTo(width * 0.5, height * 0.7)
  ctx.lineTo(width * 0.5, height)
  ctx.stroke()
  ctx.setLineDash([])

  // 办公楼
  const buildingGradient = ctx.createLinearGradient(width * 0.2, 0, width * 0.8, 0)
  buildingGradient.addColorStop(0, "#455a64")
  buildingGradient.addColorStop(1, "#37474f")
  ctx.fillStyle = buildingGradient
  ctx.fillRect(width * 0.2, height * 0.4, width * 0.6, height * 0.3)

  // 办公楼顶部
  ctx.fillStyle = "#263238"
  ctx.beginPath()
  ctx.moveTo(width * 0.18, height * 0.4)
  ctx.lineTo(width * 0.5, height * 0.3)
  ctx.lineTo(width * 0.82, height * 0.4)
  ctx.closePath()
  ctx.fill()

  // 窗户
  const windowRows = 3
  const windowCols = 6
  const windowWidth = (width * 0.6) / (windowCols * 1.5)
  const windowHeight = (height * 0.3) / (windowRows * 1.5)

  for (let row = 0; row < windowRows; row++) {
    for (let col = 0; col < windowCols; col++) {
      const windowX = width * 0.2 + col * windowWidth * 1.5 + windowWidth * 0.25
      const windowY = height * 0.4 + row * windowHeight * 1.5 + windowHeight * 0.25

      // 使用时间和位置来确定窗户的闪烁
      let windowColor
      if (progress < 25) {
        // 早晨 - 一些灯亮着，使用时间和位置来确定闪烁
        const timeOffset = Math.sin((Date.now() / 2000) + (row * 2) + col) // 降低频率并添加位置偏移
        windowColor = timeOffset > 0.7 ? "#ffeb3b" : "#263238"
      } else if (progress < 75) {
        // 白天 - 灯关着
        windowColor = "#90a4ae"
      } else if (isUrgent) {
        // 急迫模式 - 闪烁的灯光，使用较慢的时间频率
        const timeOffset = Math.sin((Date.now() / 500) + (row * 2) + col) // 降低闪烁频率
        windowColor = timeOffset > 0 ? "#ffeb3b" : "#ff5722"
      } else {
        // 傍晚 - 大多数灯亮着，使用时间和位置来确定闪烁
        const timeOffset = Math.sin((Date.now() / 2000) + (row * 2) + col)
        windowColor = timeOffset > 0.3 ? "#ffeb3b" : "#263238"
      }

      ctx.fillStyle = windowColor
      ctx.fillRect(windowX, windowY, windowWidth, windowHeight)
    }
  }

  // 门
  ctx.fillStyle = "#37474f"
  ctx.fillRect(width * 0.45, height * 0.6, width * 0.1, height * 0.1)

  // 门把手
  ctx.fillStyle = "#ffc107"
  ctx.beginPath()
  ctx.arc(width * 0.53, height * 0.65, width * 0.01, 0, Math.PI * 2)
  ctx.fill()

  // 人离开基于进度
  if (progress > 80) {
    const personX = width * 0.5 + ((progress - 80) * (width * 0.3)) / 20
    const personY = height * 0.65

    // 身体
    ctx.fillStyle = isUrgent ? "#f44336" : "#3f51b5"
    ctx.fillRect(personX - 5, personY - 15, 10, 20)

    // 头
    ctx.fillStyle = "#ffccbc"
    ctx.beginPath()
    ctx.arc(personX, personY - 25, 10, 0, Math.PI * 2)
    ctx.fill()

    // 腿
    ctx.strokeStyle = "#3e2723"
    ctx.lineWidth = 3

    // 走路动画
    const legSpeed = isUrgent ? 100 : 200 // 急迫模式下走得更快
    const legAngle = (Date.now() / legSpeed) % (Math.PI * 2)
    const legAmplitude = isUrgent ? 15 : 10 // 急迫模式下迈步更大

    ctx.beginPath()
    ctx.moveTo(personX - 3, personY + 5)
    ctx.lineTo(personX - 3 - Math.sin(legAngle) * legAmplitude, personY + 20)
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(personX + 3, personY + 5)
    ctx.lineTo(personX + 3 + Math.sin(legAngle) * legAmplitude, personY + 20)
    ctx.stroke()

    // 公文包
    ctx.fillStyle = "#795548"
    ctx.fillRect(personX + 10, personY, 8, 12)

    // 急迫模式下添加表情和动作
    if (isUrgent) {
      // 兴奋的表情
      ctx.fillStyle = "#000"
      ctx.beginPath()
      ctx.arc(personX - 3, personY - 27, 2, 0, Math.PI * 2) // 左眼
      ctx.fill()
      ctx.beginPath()
      ctx.arc(personX + 3, personY - 27, 2, 0, Math.PI * 2) // 右眼
      ctx.fill()

      // 笑脸
      ctx.beginPath()
      ctx.arc(personX, personY - 22, 5, 0, Math.PI)
      ctx.stroke()

      // 手臂挥舞
      const armAngle = (Date.now() / 50) % (Math.PI * 2)
      ctx.strokeStyle = "#3e2723"
      ctx.beginPath()
      ctx.moveTo(personX - 5, personY - 10)
      ctx.lineTo(personX - 15 - Math.sin(armAngle) * 5, personY - 15 + Math.cos(armAngle) * 5)
      ctx.stroke()
    } else {
      // 普通表情
      ctx.fillStyle = "#000"
      ctx.beginPath()
      ctx.arc(personX - 3, personY - 27, 1.5, 0, Math.PI * 2) // 左眼
      ctx.fill()
      ctx.beginPath()
      ctx.arc(personX + 3, personY - 27, 1.5, 0, Math.PI * 2) // 右眼
      ctx.fill()

      // 普通嘴巴
      ctx.beginPath()
      ctx.moveTo(personX - 3, personY - 22)
      ctx.lineTo(personX + 3, personY - 22)
      ctx.stroke()
    }
  }

  // 办公楼上的时钟
  const clockX = width * 0.5
  const clockY = height * 0.35
  const clockRadius = width * 0.05

  // 时钟面
  ctx.fillStyle = "#eceff1"
  ctx.beginPath()
  ctx.arc(clockX, clockY, clockRadius, 0, Math.PI * 2)
  ctx.fill()

  ctx.strokeStyle = "#263238"
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.arc(clockX, clockY, clockRadius, 0, Math.PI * 2)
  ctx.stroke()

  // 时钟刻度
  for (let i = 0; i < 12; i++) {
    const angle = (i / 12) * Math.PI * 2
    const innerRadius = clockRadius * 0.8
    const outerRadius = clockRadius * 0.9

    ctx.strokeStyle = "#263238"
    ctx.lineWidth = i % 3 === 0 ? 2 : 1
    ctx.beginPath()
    ctx.moveTo(clockX + Math.sin(angle) * innerRadius, clockY - Math.cos(angle) * innerRadius)
    ctx.lineTo(clockX + Math.sin(angle) * outerRadius, clockY - Math.cos(angle) * outerRadius)
    ctx.stroke()
  }

  // 时钟指针基于进度
  const hourAngle = (progress / 100) * Math.PI * 2
  const minuteAngle = ((progress % 25) / 25) * Math.PI * 2

  // 分针
  ctx.strokeStyle = "#263238"
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(clockX, clockY)
  ctx.lineTo(clockX + Math.sin(minuteAngle) * clockRadius * 0.7, clockY - Math.cos(minuteAngle) * clockRadius * 0.7)
  ctx.stroke()

  // 时针
  ctx.strokeStyle = "#263238"
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.moveTo(clockX, clockY)
  ctx.lineTo(clockX + Math.sin(hourAngle) * clockRadius * 0.5, clockY - Math.cos(hourAngle) * clockRadius * 0.5)
  ctx.stroke()

  // 中心点
  ctx.fillStyle = isUrgent ? "#f44336" : "#f44336"
  ctx.beginPath()
  ctx.arc(clockX, clockY, 3, 0, Math.PI * 2)
  ctx.fill()

  // 急迫模式下添加特效
  if (isUrgent) {
    // 添加闪烁的光晕
    const glowOpacity = ((Math.sin(Date.now() / 200) + 1) / 2) * 0.5
    const glow = ctx.createRadialGradient(width * 0.5, height * 0.6, 0, width * 0.5, height * 0.6, width * 0.4)
    glow.addColorStop(0, `rgba(255, 87, 34, ${glowOpacity})`)
    glow.addColorStop(1, "rgba(255, 87, 34, 0)")

    ctx.fillStyle = glow
    ctx.fillRect(0, 0, width, height)

    // 添加"下班"文字
    ctx.font = `bold ${width * 0.08}px Arial`
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"

    // 文字阴影
    ctx.shadowColor = "rgba(0, 0, 0, 0.5)"
    ctx.shadowBlur = 10
    ctx.shadowOffsetX = 2
    ctx.shadowOffsetY = 2

    // 脉动效果
    const scale = 1 + Math.sin(Date.now() / 150) * 0.1
    ctx.save()
    ctx.translate(width * 0.5, height * 0.2)
    ctx.scale(scale, scale)
    ctx.fillStyle = "#ff5722"
    ctx.fillText("即将下班!", 0, 0)
    ctx.restore()

    // 重置阴影
    ctx.shadowColor = "transparent"
    ctx.shadowBlur = 0
    ctx.shadowOffsetX = 0
    ctx.shadowOffsetY = 0
  }
}

// 添加绘制云朵的函数
function drawClouds(ctx: CanvasRenderingContext2D, width: number, height: number, progress: number) {
  // 基于时间的云朵位置
  const time = Date.now() / 10000
  const cloudPositions = [
    { x: (time * width * 0.05) % width, y: height * 0.15, size: width * 0.15 },
    { x: ((time + 0.3) * width * 0.03) % width, y: height * 0.25, size: width * 0.2 },
    { x: ((time + 0.7) * width * 0.04) % width, y: height * 0.1, size: width * 0.12 },
  ]

  // 云朵颜色基于一天中的时间
  let cloudColor
  if (progress < 25) {
    cloudColor = "rgba(255, 255, 255, 0.8)"
  } else if (progress < 50) {
    cloudColor = "rgba(255, 255, 255, 0.9)"
  } else if (progress < 75) {
    cloudColor = "rgba(255, 245, 224, 0.8)"
  } else {
    cloudColor = "rgba(255, 222, 173, 0.7)"
  }

  // 绘制每朵云
  cloudPositions.forEach((cloud) => {
    const { x, y, size } = cloud

    ctx.fillStyle = cloudColor

    // 绘制云朵形状
    ctx.beginPath()
    ctx.arc(x, y, size * 0.4, 0, Math.PI * 2)
    ctx.arc(x + size * 0.3, y - size * 0.1, size * 0.3, 0, Math.PI * 2)
    ctx.arc(x + size * 0.6, y, size * 0.35, 0, Math.PI * 2)
    ctx.arc(x + size * 0.3, y + size * 0.1, size * 0.3, 0, Math.PI * 2)
    ctx.fill()
  })
}
