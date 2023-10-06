import Head from "next/head";

import ThreeLogoRepresentation from "../components/three.component";

export default function Home() {
  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@100&display=swap"
          rel="stylesheet"
        ></link>
      </Head>
      <main className="flex items-center justify-center">
        <ThreeLogoRepresentation />
      </main>
    </>
  );
}