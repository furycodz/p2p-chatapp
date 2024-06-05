
import { Inter } from "next/font/google";
import "./globals.css";
import "@fortawesome/fontawesome-svg-core/styles.css";  

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "P2P ChatApp",
  description: "Une application Chat utilisant la technologie Peer2Peer",
};

export default function RootLayout({ children }) {

  return (
    <html lang="en">
    
      <body className={inter.className}>{children}</body>
    </html>
  );
}
