import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Green Guardian — Plant Disease Diagnosis",
  description: "AI-powered plant disease detection. Upload a leaf photo and get an instant diagnosis.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}