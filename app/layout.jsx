import "@styles/globals.css";
import Provider from "@components/Provider";
import { Suspense } from "react";
import Nav from "@components/organisms/Nav";
import Footer from "@components/organisms/Footer";

export const metadata = {
  title: "CekCok",
  description: "Discover & Share Argument Thoughts",
};

export default function RootLayout({ children, session }) {
  return (
    <html lang="en">
      <Provider session={session}>
        <main className="app">
          <Nav />
          <Suspense>{children}</Suspense>
          <Footer />
        </main>
      </Provider>
    </html>
  );
}
