import React, { Suspense } from "react";
import SidebarNav from "./components/SidebarNav"; // Adjust path if your folder structure differs
import "./globals.css";

export const metadata = {
  title: "WARDOGS // Tactical Treasury HUD",
  description: "Centralized intelligence command, gold rate telemetry, and combat archives.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#060608] text-slate-100 flex min-h-screen antialiased selection:bg-[#c89b3c] selection:text-black">
        {/* Wrap SidebarNav in a Suspense boundary so usePathname() doesn't block dynamic prerendering */}
        <Suspense fallback={<div className="w-64 bg-[#0d0d10] border-r border-[#222327] hidden md:block" />}>
          <SidebarNav />
        </Suspense>

        {/* Main Content Area */}
        <main className="flex-1 p-6 md:p-10 overflow-y-auto">
          {children}
        </main>
      </body>
    </html>
  );
}