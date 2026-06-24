import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

import { PlatformSetting } from "@/models/PlatformSetting";
import dbConnect from "@/lib/mongoose";

export async function generateMetadata(): Promise<Metadata> {
  let title = "SaaS Platform";
  let faviconUrl = "/favicon.ico";

  try {
    await dbConnect();
    const [nameSetting, faviconSetting] = await Promise.all([
      PlatformSetting.findOne({ key: "platformName" }),
      PlatformSetting.findOne({ key: "favicon" })
    ]);
    
    if (nameSetting?.value) title = nameSetting.value;
    if (faviconSetting?.value) faviconUrl = faviconSetting.value;
  } catch (e) {
    console.error("Error loading metadata settings:", e);
  }

  return {
    title: title,
    description: "Your platform description here",
    icons: {
      icon: faviconUrl
    }
  };
}

import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "react-hot-toast";
import { SettingsProvider } from "@/components/providers/SettingsProvider";
import { auth } from "@/auth";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let settings = {
    currency: "USD ($)",
    timezone: "UTC",
    dateFormat: "MM/DD/YYYY",
    maintenanceMode: false
  };

  try {
    await dbConnect();
    const [currencySetting, timezoneSetting, dateFormatSetting, maintenanceSetting] = await Promise.all([
      PlatformSetting.findOne({ key: "defaultCurrency" }),
      PlatformSetting.findOne({ key: "timezone" }),
      PlatformSetting.findOne({ key: "dateFormat" }),
      PlatformSetting.findOne({ key: "maintenanceMode" })
    ]);
    
    if (currencySetting?.value) settings.currency = currencySetting.value;
    if (timezoneSetting?.value) settings.timezone = timezoneSetting.value;
    if (dateFormatSetting?.value) settings.dateFormat = dateFormatSetting.value;
    if (maintenanceSetting?.value === "true") settings.maintenanceMode = true;
  } catch (e) {
    console.error("Error loading global settings:", e);
  }

  // Check Maintenance Mode
  if (settings.maintenanceMode) {
    const session = await auth();
    const isAdmin = session?.user && ((session.user as any).role?.toUpperCase() === "ADMIN" || session.user.email === "admin@gmail.com");
    if (!isAdmin) {
      return (
        <html lang="en" className="h-full antialiased">
          <body className={`${inter.variable} h-full flex flex-col items-center justify-center font-sans bg-gray-50 text-gray-900 p-4 text-center`}>
            <div className="max-w-md p-8 bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="h-16 w-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold mb-2">Under Maintenance</h1>
              <p className="text-gray-500 mb-6">We are currently performing scheduled maintenance. We'll be back online shortly. Thank you for your patience!</p>
            </div>
          </body>
        </html>
      );
    }
  }

  return (
    <html lang="en" suppressHydrationWarning className="h-full antialiased">
      <head>
        <Script
          id="theme-script"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var savedColor = localStorage.getItem('accent-color');
                if (savedColor) {
                  var root = document.documentElement;
                  root.style.setProperty('--primary', savedColor);
                  root.style.setProperty('--ring', savedColor);
                  root.style.setProperty('--sidebar-primary', savedColor);
                  root.style.setProperty('--sidebar-ring', savedColor);
                  root.style.setProperty('--primary-foreground', '#ffffff');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body style={{ fontFamily: "var(--font-sans), sans-serif" }} className={`${inter.variable} min-h-full flex flex-col font-sans bg-background text-foreground`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SettingsProvider initialSettings={settings}>
            {children}
          </SettingsProvider>
          <Toaster position="bottom-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
