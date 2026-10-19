import type { Metadata } from "next";
import "./globals.css";
import { LayoutLabProvider } from "@/context/LayoutLabContext";

export const metadata: Metadata = {
  title: "Home Page",
  description:
    "FirstCoreMVCApplication - Master Layout, CSS Styling & Three.js Glass Lens Experience",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <LayoutLabProvider>{children}</LayoutLabProvider>
      </body>
    </html>
  );
}
