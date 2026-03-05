// app/layout.tsx
import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import localFont from "next/font/local";
import "./styles/index.css";
import { Providers } from "./components/Providers";
import Header from "./components/Header/Header";
import Breadcrumbs from "./components/Breadcrumbs/Breadcrumbs";

// Montserrat
const montserrat = Montserrat({
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-montserrat",
});

// Gilroy (local)
const gilroy = localFont({
  src: [
    { path: "../public/fonts/Gilroy-Regular.woff2", weight: "400", style: "normal" },
    { path: "../public/fonts/Gilroy-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-gilroy",
  display: "swap",
});

// Raleway (local)
const raleway = localFont({
  src: [
    { path: "../public/fonts/Raleway-Regular.woff2", weight: "400", style: "normal" },
    { path: "../public/fonts/Raleway-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-raleway",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Test Work",
    template: "%s | Test Work",
  },
  description: "Next.js, React, Redux",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" dir="ltr" className={`${montserrat.variable} ${gilroy.variable} ${raleway.variable}`}>
      <body className="antialiased">
        <Providers>
          <div className="main-wrapper">
            <Header />
            <main>{children}</main>
            <Breadcrumbs />
          </div>
        </Providers>
      </body>
    </html>
  );
}
