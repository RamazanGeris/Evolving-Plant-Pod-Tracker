import { Routes, Route, Link, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import PodDetail from "./pages/PodDetail"; // Bir sonraki adımda oluşturacağız
import TestPage from "./pages/test"; 
import { useEffect, useState } from "react";
import PodForm from "./components/PodForm";

const LOGO_COLOR = "#1D6F22";
const SLOGAN = "Doğadan İlham Alan Akıllı Takip";
const NAV_COLOR = "#875800";
const NAV_HOVER = "#B8D9A2";

function Header() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header
      className={`fixed top-0 left-0 w-full z-30 transition-all duration-300 ${
        scrolled ? "bg-white/80 shadow-md backdrop-blur" : "bg-white/95"
      }`}
      style={{ borderBottom: `2px solid #B8D9A2` }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-8 py-4">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="font-extrabold text-3xl tracking-tight select-none"
            style={{ color: LOGO_COLOR, letterSpacing: "-1px", cursor: 'pointer' }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            Selvy
          </Link>
          <span className="hidden sm:inline text-green-900 font-medium text-lg ml-2 opacity-80">
            {SLOGAN}
          </span>
        </div>
        <nav className="flex gap-8">
          <Link
            to="/"
            className="font-semibold text-lg transition px-2 py-1 rounded"
            style={{ color: NAV_COLOR }}
            onMouseOver={e => (e.target.style.color = NAV_HOVER)}
            onMouseOut={e => (e.target.style.color = NAV_COLOR)}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            Ana Sayfa
          </Link>
          <Link
            to="/"
            onClick={() => window.scrollTo({ top: 600, behavior: "smooth" })}
            className="font-semibold text-lg transition px-2 py-1 rounded"
            style={{ color: NAV_COLOR }}
            onMouseOver={e => (e.target.style.color = NAV_HOVER)}
            onMouseOut={e => (e.target.style.color = NAV_COLOR)}
          >
            Podlarım
          </Link>
        </nav>
      </div>
    </header>
  );
}

function WelcomeHero() {
  return (
    <div
      className="w-full flex flex-col items-center justify-center py-20 mb-8 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(120deg, #B8D9A2 0%, #fff 100%)",
        minHeight: 320,
      }}
    >
      {/* Doğa dokusu için SVG veya PNG arka plan eklenebilir */}
      <svg
        className="absolute left-0 top-0 w-full h-full opacity-20 pointer-events-none"
        viewBox="0 0 1440 320"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill="#B8D9A2"
          fillOpacity="0.4"
          d="M0,160L60,170.7C120,181,240,203,360,197.3C480,192,600,160,720,133.3C840,107,960,85,1080,101.3C1200,117,1320,171,1380,197.3L1440,224L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
        ></path>
      </svg>
      <h1 className="text-4xl sm:text-5xl font-extrabold text-green-900 mb-4 z-10 drop-shadow-lg">
        Selvy
      </h1>
      <p className="text-xl sm:text-2xl text-green-800 font-medium mb-6 z-10">
        {SLOGAN}
      </p>
      <div className="bg-white/80 rounded-xl px-6 py-3 shadow-md border border-green-200 z-10">
        <span className="text-green-900 font-semibold text-lg">
          Hoş geldin! Bitkilerini Selvy ile takip et.
        </span>
      </div>
    </div>
  );
}

function App() {
  const location = useLocation();
  // Home sayfasında pod ekleme fonksiyonunu burada tanımla
  const [refresh, setRefresh] = useState(false);
  const handleAddPod = () => setRefresh(r => !r);
  // Sadece ana sayfada sidebar göster
  const showSidebar = location.pathname === "/";
  return (
    <div className="flex min-h-screen w-full relative overflow-x-hidden bg-[#F7FAF5]" style={{ fontFamily: "Inter, sans-serif" }}>
      {/* Sidebar sadece ana sayfada */}
      {showSidebar && (
        <aside
          className="hidden lg:flex flex-col px-8"
          style={{
            position: 'fixed',
            top: '88px',
            left: 0,
            width: '480px',
            height: 'calc(100vh - 88px)',
            zIndex: 30,
          }}
        >
          <div className="flex-1 flex flex-col justify-start h-full overflow-y-auto">
            <PodForm onSubmit={handleAddPod} />
          </div>
        </aside>
      )}
      <div className="flex-1 flex flex-col min-h-screen" style={{ marginLeft: showSidebar ? '480px' : 0 }}>
        <Header />
        <main className="pt-32 px-8 flex-1">
          <Routes>
            <Route path="/" element={<Home refresh={refresh} />} />
            <Route path="/pods/:id" element={<PodDetail />} />
            <Route path="/test" element={<TestPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;