import { Inter as Font } from "next/font/google";
import "./globals.scss";
import QueryClientContext from "@/components/common/constants/QueryClient";
import StoreProvider from "@/components/common/constants/StoreProvider";

const font = Font({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata = {
  title: "MIT Innovation Centre",
  description: "MIT Innovation Centre",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={font.className}>
        <StoreProvider>
          <QueryClientContext>{children}</QueryClientContext>
        </StoreProvider>
      </body>
    </html>
  );
}
