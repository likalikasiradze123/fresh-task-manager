import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Lika's Workshop",
  description: "ხელნაკეთი ნივთების ექსკლუზიური სახელოსნო",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ka" className={`${playfair.variable} ${jakarta.variable}`}>
      <body className="font-sans bg-[#F9F6F0] text-[#334135] antialiased selection:bg-[#C98B9B] selection:text-white">
        {children}
      </body>
    </html>
  );
}