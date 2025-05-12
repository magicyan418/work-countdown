import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Work CountDown',
  description: 'This is a work countdown website',
  generator: 'Next.js',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
