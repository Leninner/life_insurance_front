import { ReactNode } from 'react'

interface OnboardingLayoutProps {
  children: ReactNode
}

export default function OnboardingLayout({ children }: OnboardingLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-8">{children}</div>
    </div>
  )
}
