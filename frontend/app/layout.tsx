import type React from "react"
import { Lexend_Deca } from "next/font/google"
import "./globals.css"

const lexend = Lexend_Deca({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
})

export const metadata = {
  title: "ReadBuddy - AI Reading Tutor",
  description: "Helping young readers succeed with AI-powered coaching",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={lexend.className}>{children}</body>
    </html>
  )
}
