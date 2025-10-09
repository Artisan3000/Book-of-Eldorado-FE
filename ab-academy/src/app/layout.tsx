import type { Metadata } from "next";
import "./globals.css";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";

export const metadata: Metadata = {
  title: "Artisan Barber Academy",
  description: "Learn barbering skills from beginner to advanced",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased`}
      >
        <Navigation />
        <main> {children}</main>
        <Footer />
      </body>
      
    </html>
  );
}
