import type { Metadata } from "next";
import SidebarNav from "@/app/components/SidebarNav";
import "./globals.css";

export const metadata: Metadata = {
  title: "WARDOGS TREASURY",
  description: "Official Wardogs Treasury daily gold telemetry, news bulletins, and community video archives.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* INLINE SVG FAVICON */}
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 110'><path d='M50 5 L92 22 V55 C92 78 72 98 50 105 C28 98 8 78 8 55 V22 Z' fill='%23c89b3c'/><path d='M50 12 L84 26 V52 C84 71 67 88 50 94 C33 88 16 71 16 52 V26 Z' fill='%23060608'/><text x='50' y='64' text-anchor='middle' fill='%23c89b3c' font-size='36' font-weight='900' font-family='monospace'>WT</text></svg>"
        />
      </head>
      <body className="bg-[#060608] text-slate-100 flex min-h-screen">
        {/* SIDEBAR NAVIGATION */}
        <SidebarNav />

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 p-6 md:p-10 overflow-y-auto">
          {children}
        </main>
      </body>
    </html>
  );
}