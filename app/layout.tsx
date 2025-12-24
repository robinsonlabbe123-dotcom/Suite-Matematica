import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CRM Autopilot",
  description: "MicroSaaS CRM + Sales Autopilot",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <div className="mx-auto max-w-6xl p-6">
          <header className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">CRM Autopilot</h1>
              <p className="text-sm text-slate-600">
                Multi-tenant CRM + Autopilot de ventas con Supabase.
              </p>
            </div>
            <nav className="flex gap-3 text-sm text-slate-700">
              <a href="/app/dashboard" className="hover:underline">
                Dashboard
              </a>
              <a href="/app/contacts" className="hover:underline">
                Contacts
              </a>
              <a href="/app/deals" className="hover:underline">
                Deals
              </a>
              <a href="/app/tasks" className="hover:underline">
                Tasks
              </a>
              <a href="/app/settings/org" className="hover:underline">
                Settings
              </a>
            </nav>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
