import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { VendorProvider } from "@/context/VendorContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TechnoTran Vendor Portal",
  description: "Manage your vendor operations efficiently",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <VendorProvider>{children}</VendorProvider>
      </body>
    </html>
  );
}
