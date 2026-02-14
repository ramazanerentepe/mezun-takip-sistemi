import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { Icon, icons } from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Mezun Takip Sistemi",
  description: "KTÜN Mezun Takip ve İletişim Portalı",
  icons: {
    icon : '/logo.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}> {/*defaultTheme="system" yap*/} 
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}