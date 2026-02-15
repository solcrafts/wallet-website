import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "./App.css";
import "./i18n";

const LoadingScreen = ({ onFinished }: { onFinished: () => void }) => {
  const [isFading, setIsFading] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFading(true);
      setTimeout(onFinished, 800);
    }, 2500);
    return () => clearTimeout(timer);
  }, [onFinished]);

  return (
    <div className="loading-screen" style={{ opacity: isFading ? 0 : 1, pointerEvents: isFading ? "none" : "all" }}>
      <div className="loader-container">
        <div className="loader-orbit orbit-1"></div>
        <div className="loader-orbit orbit-2"></div>
        <div className="loader-orbit orbit-3"></div>
        <img src="/logo.png" className="loader-logo" alt="Loading..." />
      </div>
      <div className="loading-text">{t("loading")}</div>
    </div>
  );
};

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  if (isLoading) {
    return <LoadingScreen onFinished={() => setIsLoading(false)} />;
  }

  return (
    <div className="app-container fade-in-up">
      <div className="bg-orb orb-1"></div>
      <div className="bg-orb orb-2"></div>
      <div className="bg-orb orb-3"></div>

      <div className="language-switcher">
        <button onClick={() => changeLanguage("en")} className={i18n.language === "en" ? "active" : ""}>
          EN
        </button>
        <button onClick={() => changeLanguage("zh-CN")} className={i18n.language === "zh-CN" ? "active" : ""}>
          简
        </button>
        <button onClick={() => changeLanguage("zh-TW")} className={i18n.language === "zh-TW" ? "active" : ""}>
          繁
        </button>
      </div>

      <header className="hero-section">
        <img src="/logo.png" className="hero-logo" alt="AGIPOCKET Logo" />
        <h1 className="hero-title">{t("hero.title")}</h1>
        <p className="hero-subtitle">{t("hero.subtitle")}</p>

        <div className="neu-btn-group">
          <a href="https://github.com/solcrafts" target="_blank" rel="noopener noreferrer" className="neu-btn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.38.6.12.8-.26.8-.58v-2.03c-3.34.73-4.04-1.42-4.04-1.42-.54-1.39-1.33-1.76-1.33-1.76-1.08-.74.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.49 1 .1-.78.42-1.31.76-1.61-2.66-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1-.32 3.3 1.23.95-.27 1.98-.4 3-.4 1.02 0 2.05.13 3 .4 2.3-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.62-5.49 5.92.43.37.82 1.1.82 2.22v3.29c0 .32.19.7.8.58C20.57 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
            {t("buttons.github")}
          </a>

          <a href="https://x.com/aisolcraft" target="_blank" rel="noopener noreferrer" className="neu-btn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.66l-5.21-6.82-5.96 6.82H1.68l7.73-8.84L1.25 2.25h6.83l4.71 6.23z" />
            </svg>
            {t("buttons.twitter")}
          </a>

          <a href="https://github.com/solcrafts/wallet/releases" target="_blank" rel="noopener noreferrer" className="neu-btn primary">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
            </svg>
            {t("buttons.download")}
          </a>

          <a href="/skill.md" target="_blank" rel="noopener noreferrer" className="neu-btn secondary">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm-1 5h2v6h-2zm0 8h2v2h-2z" />
            </svg>
            {t("buttons.agent")}
          </a>
        </div>
      </header>

      <section className="features-grid">
        <div className="glass-card delay-1">
          <div className="card-icon">🛡</div>
          <h3 className="card-title">{t("features.identity.title")}</h3>
          <p className="card-text">{t("features.identity.desc")}</p>
        </div>

        <div className="glass-card delay-2">
          <div className="card-icon">🤖</div>
          <h3 className="card-title">{t("features.execution.title")}</h3>
          <p className="card-text">{t("features.execution.desc")}</p>
        </div>

        <div className="glass-card delay-3">
          <div className="card-icon">🔒</div>
          <h3 className="card-title">{t("features.intent.title")}</h3>
          <p className="card-text">{t("features.intent.desc")}</p>
        </div>
      </section>

      <section className="vision-section fade-in-up delay-2">
        <h2 style={{ fontSize: "2.5rem", marginBottom: "2rem", color: "#e8f2ff" }}>{t("vision.title")}</h2>
        <p style={{ fontSize: "1.2rem", lineHeight: "1.8", maxWidth: "800px", margin: "0 auto", color: "#b7c8e7" }}>{t("vision.desc")}</p>
      </section>

      <footer>
        <div className="footer-content">
          <p>{t("footer", { year: new Date().getFullYear() })}</p>
          <div className="footer-links">
            <a href="https://x.com/aisolcraft" target="_blank" rel="noopener noreferrer" aria-label="Twitter / X">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.66l-5.21-6.82-5.96 6.82H1.68l7.73-8.84L1.25 2.25h6.83l4.71 6.23z" />
              </svg>
            </a>
            <a href="https://github.com/solcrafts" target="_blank" rel="noopener noreferrer" aria-label="Github">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.38.6.12.8-.26.8-.58v-2.03c-3.34.73-4.04-1.42-4.04-1.42-.54-1.39-1.33-1.76-1.33-1.76-1.08-.74.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.49 1 .1-.78.42-1.31.76-1.61-2.66-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1-.32 3.3 1.23.95-.27 1.98-.4 3-.4 1.02 0 2.05.13 3 .4 2.3-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.62-5.49 5.92.43.37.82 1.1.82 2.22v3.29c0 .32.19.7.8.58C20.57 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
