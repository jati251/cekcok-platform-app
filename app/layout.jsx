import "@styles/globals.css";
import Provider from "@components/Provider";
import Nav from "@components/Nav";
import { Suspense } from "react";
import Footer from "@components/Footer";
import Head from "next/head";

export const metadata = {
  title: "CekCok",
  description: "Discover & Share Argument Thoughts",
};

export default function RootLayout({ children, session }) {
  return (
    <html lang="en">
      <Head>
        <meta
          http-equiv="Content-Security-Policy"
          content="upgrade-insecure-requests"
        />
      </Head>
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
