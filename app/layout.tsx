import './globals.css'
import { ToastProvider } from '@/components/providers/toast-provider';
import { ClerkProvider } from '@clerk/nextjs';
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'LMS Platform Next App',
  description: '',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
      <body className={inter.className}>
        <ToastProvider />
        {children}
      </body>
      </html>
    </ClerkProvider>
  )
}
