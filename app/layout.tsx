import './globals.css'
import Sidebar from '../components/Sidebar'

export const metadata = {
  title: 'WARDOG TREASURY',
  description: 'Zero-budget, AI-driven gaming news & intelligence hub.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="bg-slate-950">
      <body className="bg-slate-950 text-slate-100 antialiased min-h-screen flex selection:bg-amber-500 selection:text-slate-950">
        <Sidebar />
        <div className="flex-1 ml-20 transition-all duration-300 bg-slate-950 min-h-screen">
          {children}
        </div>
      </body>
    </html>
  )
}
