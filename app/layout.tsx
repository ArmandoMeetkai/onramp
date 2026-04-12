import type { Metadata, Viewport } from "next"
import { Inter, DM_Sans } from "next/font/google"
import { ClientShell } from "@/components/layout/ClientShell"
import { Toaster } from "sonner"
import "./globals.css"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
})

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
})

export const metadata: Metadata = {
  title: {
    default: "Onramp",
    template: "%s — Onramp",
  },
  description: "The first safe place to think before entering crypto",
  manifest: "/manifest.json",
  icons: {
    apple: "/icons/icon-192.svg",
  },
  openGraph: {
    type: "website",
    siteName: "Onramp",
    title: "Onramp",
    description: "The first safe place to think before entering crypto",
  },
  twitter: {
    card: "summary",
    title: "Onramp",
    description: "The first safe place to think before entering crypto",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Onramp",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#2D5A3D",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${dmSans.variable} h-full`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('onramp-theme');if(t==='light'){document.documentElement.classList.remove('dark')}else{document.documentElement.classList.add('dark')}}catch(e){document.documentElement.classList.add('dark')}})()`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col antialiased" suppressHydrationWarning>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){if(!('serviceWorker' in navigator))return;if(location.hostname==='localhost'||location.hostname==='127.0.0.1'){navigator.serviceWorker.getRegistrations().then(function(regs){if(regs.length>0){Promise.all(regs.map(function(r){return r.unregister()})).then(function(){if('caches' in window){caches.keys().then(function(keys){Promise.all(keys.map(function(k){return caches.delete(k)}))})}})}});return;}navigator.serviceWorker.register('/sw.js').then(function(reg){reg.update()})})()`,
          }}
        />
        <ClientShell>{children}</ClientShell>
        <Toaster position="top-center" richColors closeButton />
      </body>
    </html>
  )
}
