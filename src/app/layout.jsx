import "./globals.css";

export const metadata = {
  title: "SpeakLab | Living Language Space",
  description: "A cinematic AI English speaking platform for immersive conversation practice."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
