import type { Metadata } from "next";
import "./globals.css";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import { getCurrentUser } from "@/lib/current-user";
import { toAppUser } from "@/lib/user";

export const metadata: Metadata = {
  title: "Artisan Barber Foundation",
  description: "Professional barbering education for modern stylists.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const currentUser = await getCurrentUser();
  const user = currentUser ? toAppUser(currentUser) : null;

  return (
    <html lang="en">
      <body className="antialiased">
        <Navigation user={user} />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
