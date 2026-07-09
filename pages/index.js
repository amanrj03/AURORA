import { useState, useEffect } from "react";
import Head from "next/head";
import LandingPage from "../components/LandingPage";
import ConsolePage from "../components/ConsolePage";
import AuthPage from "../components/AuthPage";

export default function Home() {
  const [showApp, setShowApp] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [initialQuery, setInitialQuery] = useState("");
  
  // Session details
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // Load session from cache on startup
  useEffect(() => {
    const savedToken = localStorage.getItem("aurora_token");
    const savedUser = localStorage.getItem("aurora_user");
    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Failed loading session:", e);
      }
    }
  }, []);

  const handleAuthSuccess = (newToken, newUser) => {
    localStorage.setItem("aurora_token", newToken);
    localStorage.setItem("aurora_user", JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
    setShowAuth(false);
    setShowApp(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("aurora_token");
    localStorage.removeItem("aurora_user");
    setToken(null);
    setUser(null);
    setShowApp(false);
    setShowAuth(false);
    setInitialQuery("");
  };

  const handleUpdateUser = (newToken, newUser) => {
    localStorage.setItem("aurora_token", newToken);
    localStorage.setItem("aurora_user", JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const handleLaunch = () => {
    if (token) {
      setShowApp(true);
    } else {
      setShowAuth(true);
    }
  };

  const handleDirectSearch = (query) => {
    setInitialQuery(query);
    if (token) {
      setShowApp(true);
    } else {
      setShowAuth(true);
    }
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
      
      {showAuth ? (
        <AuthPage 
          onBack={() => setShowAuth(false)}
          onAuthSuccess={handleAuthSuccess}
        />
      ) : showApp ? (
        <ConsolePage 
          onBack={() => {
            setShowApp(false);
            setInitialQuery("");
          }} 
          initialQuery={initialQuery}
          user={user}
          token={token}
          onUpdateUser={handleUpdateUser}
          onLogout={handleLogout}
        />
      ) : (
        <LandingPage 
          onLaunch={handleLaunch} 
          onDirectSearch={handleDirectSearch}
          isLoggedIn={!!token}
        />
      )}
    </>
  );
}
