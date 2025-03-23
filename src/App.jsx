import { BrowserRouter } from "react-router-dom";
import { Suspense, lazy, useState, useEffect } from "react";
import { Hero, Navbar } from "./components";
import CursorEffect from "./components/CursorEffect";
import InitialLoader from "./components/InitialLoader";
import { useMediaQuery } from "./hooks";

// 遅延読み込みするコンポーネントの定義
const Products = lazy(() => import("./components/Products"));
const Services = lazy(() => import("./components/Services"));
const About = lazy(() => import("./components/About"));
const Company = lazy(() => import("./components/Company"));
const News = lazy(() => import("./components/News"));
const Contact = lazy(() => import("./components/Contact"));
const StarsCanvas = lazy(() => import("./components/canvas/Stars"));

// ローディング表示用コンポーネント
const LoadingFallback = () => (
  <div className="w-full h-screen flex items-center justify-center bg-primary">
    <div className="w-8 h-8 border-4 border-blue-500 rounded-full animate-spin border-t-transparent"></div>
  </div>
);

const App = () => {
  const isMobile = useMediaQuery("(max-width: 767px)");
  const [loadedComponents, setLoadedComponents] = useState({
    products: false,
    services: false,
    about: false,
    company: false,
    news: false,
    contact: false,
    stars: false
  });

  // モバイルではすべてのコンポーネントを段階的に読み込む
  useEffect(() => {
    if (isMobile) {
      // 最初にHeadとAboutを優先して読み込む
      setTimeout(() => {
        import("./components/Products").then(() => setLoadedComponents(prev => ({...prev, products: true})));
      }, 500);
      
      setTimeout(() => {
        import("./components/Services").then(() => setLoadedComponents(prev => ({...prev, services: true})));
      }, 1000);
      
      setTimeout(() => {
        import("./components/About").then(() => setLoadedComponents(prev => ({...prev, about: true})));
      }, 1500);
      
      // 残りのコンポーネントを順次読み込む
      setTimeout(() => {
        import("./components/Company").then(() => setLoadedComponents(prev => ({...prev, company: true})));
      }, 2000);
      
      setTimeout(() => {
        import("./components/News").then(() => setLoadedComponents(prev => ({...prev, news: true})));
      }, 2500);
      
      setTimeout(() => {
        import("./components/Contact").then(() => setLoadedComponents(prev => ({...prev, contact: true})));
      }, 3000);
      
      setTimeout(() => {
        import("./components/canvas/Stars").then(() => setLoadedComponents(prev => ({...prev, stars: true})));
      }, 4000);
    } else {
      // デスクトップでは一度にすべてのコンポーネントを読み込む
      setLoadedComponents({
        products: true,
        services: true,
        about: true,
        company: true,
        news: true,
        contact: true,
        stars: true
      });
    }
  }, [isMobile]);

  return (
    <BrowserRouter>
      <InitialLoader />
      {!isMobile && <CursorEffect />}
      <div className="relative z-0 bg-primary snap-y snap-mandatory h-screen overflow-y-auto">
        {/* 最初に読み込むコンポーネント */}
        <div id="hero" className="bg-hero-pattern bg-cover bg-no-repeat bg-center snap-start min-h-screen">
          <Navbar />
          <Hero />
        </div>

        {/* 遅延読み込みするコンポーネント */}
        <Suspense fallback={<LoadingFallback />}>
          <div id="products" className="snap-start min-h-screen">
            {loadedComponents.products && <Products />}
          </div>
        </Suspense>

        <Suspense fallback={<LoadingFallback />}>
          <div id="services" className="snap-start min-h-screen">
            {loadedComponents.services && <Services />}
          </div>
        </Suspense>

        <Suspense fallback={<LoadingFallback />}>
          <div id="about" className="snap-start min-h-screen">
            {loadedComponents.about && <About />}
          </div>
        </Suspense>

        <Suspense fallback={<LoadingFallback />}>
          <div id="company" className="snap-start min-h-screen">
            {loadedComponents.company && <Company />}
          </div>
        </Suspense>

        <Suspense fallback={<LoadingFallback />}>
          <div id="news" className="snap-start min-h-screen">
            {loadedComponents.news && <News />}
          </div>
        </Suspense>

        <Suspense fallback={<LoadingFallback />}>
          <div id="contact" className="snap-start min-h-screen">
            {loadedComponents.contact && <Contact />}
          </div>
        </Suspense>

        <Suspense fallback={null}>
          {loadedComponents.stars && <StarsCanvas />}
        </Suspense>
      </div>
    </BrowserRouter>
  );
}

export default App;
