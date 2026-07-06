import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Lenis from "lenis";
import { setLenis, scrollTop } from "./lib/lenis";
import ConstellationField from "./components/background/ConstellationField";
import Nav from "./components/nav/Nav";
import Footer from "./components/footer/Footer";
import Home from "./pages/Home";
import Plattform from "./pages/Plattform";
import Preise from "./pages/Preise";
import Ueber from "./pages/Ueber";
import Kontakt from "./pages/Kontakt";
import Impressum from "./pages/Impressum";
import Datenschutz from "./pages/Datenschutz";
import Agb from "./pages/Agb";

function AnimatedRoutes() {
  const location = useLocation();
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    scrollTop();
  }, [location.pathname]);

  const variants = prefersReduced
    ? {}
    : {
        initial: { opacity: 0, y: 14 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -14 },
      };

  return (
    <AnimatePresence mode="wait">
      <motion.main
        key={location.pathname}
        className="app-main"
        {...variants}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/plattform" element={<Plattform />} />
          <Route path="/preise" element={<Preise />} />
          <Route path="/ueber" element={<Ueber />} />
          <Route path="/kontakt" element={<Kontakt />} />
          <Route path="/impressum" element={<Impressum />} />
          <Route path="/datenschutz" element={<Datenschutz />} />
          <Route path="/agb" element={<Agb />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </motion.main>
    </AnimatePresence>
  );
}

export default function App() {
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (prefersReduced) return;
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    setLenis(lenis);
    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      setLenis(null);
    };
  }, [prefersReduced]);

  return (
    <BrowserRouter>
      <ConstellationField />
      <div className="grain" aria-hidden="true" />
      <div className="vignette" aria-hidden="true" />
      <Nav />
      <AnimatedRoutes />
      <Footer />
    </BrowserRouter>
  );
}
