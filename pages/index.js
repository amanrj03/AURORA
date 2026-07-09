import { useState } from "react";
import Head from "next/head";
import LandingPage from "../components/LandingPage";
import ConsolePage from "../components/ConsolePage";

export default function Home() {
  const [showApp, setShowApp] = useState(false);
  const [initialQuery, setInitialQuery] = useState("");

  const handleLaunchWithQuery = (query) => {
    setInitialQuery(query);
    setShowApp(true);
  };

  return (
    <>
      <Head>
        <title>AURORA — Premium Equity Intelligence &amp; Autonomous Auditor</title>
        <meta name="description" content="Cinematic equity research pipeline powered by LangChain and Google Gemini." />
        <meta property="og:title" content="AURORA" />
        <meta property="og:description" content="Cinematic equity research pipeline powered by LangChain and Google Gemini." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      
      {showApp ? (
        <ConsolePage 
          onBack={() => {
            setShowApp(false);
            setInitialQuery("");
          }} 
          initialQuery={initialQuery}
        />
      ) : (
        <LandingPage 
          onLaunch={() => setShowApp(true)} 
          onDirectSearch={handleLaunchWithQuery}
        />
      )}
    </>
  );
}
