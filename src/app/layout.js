import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider"; // Kendi oluşturduğumuz provider

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
      <body className={`${inter.className} bg-background text-foreground transition-colors duration-300`}>
        <ThemeProvider 
          attribute="class" 
          defaultTheme="system" 
          enableSystem={true}
          disableTransitionOnChange
        > 
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}