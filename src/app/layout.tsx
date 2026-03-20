import "./globals.css";
import { Providers } from "@/lib/providers";

export const metadata = {
  title: "Starknet Meetup Japan",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
