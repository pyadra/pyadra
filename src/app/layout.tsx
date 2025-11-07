import "./globals.css";

export const metadata = {
  title: "Pyadra",
  description: "Every action feeds the light.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-dvh antialiased">{children}</body>
    </html>
  );
}