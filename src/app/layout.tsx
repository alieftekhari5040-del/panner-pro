import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "پنر پرو | سیستم گیمیفیکیشن شخصی",
  description: "سیستم مدیریت چالش‌ها و مدال‌های شخصی",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <head>
        <link
          href="https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/Vazirmatn-font-face.css"
          rel="stylesheet"
        />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0a0a0f" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
