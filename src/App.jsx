import { BrowserRouter } from "react-router-dom";
import { Suspense, lazy } from "react";
import { Hero, Navbar } from "./components";
import CursorEffect from "./components/CursorEffect";
import InitialLoader from "./components/InitialLoader";

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
  return (
    <BrowserRouter>
      <InitialLoader />
      <CursorEffect />
      <div className="relative z-0 bg-primary snap-y snap-mandatory h-screen overflow-y-auto">
        {/* 最初に読み込むコンポーネント */}
        <div id="hero" className="bg-hero-pattern bg-cover bg-no-repeat bg-center snap-start min-h-screen">
          <Navbar />
          <Hero />
        </div>

        {/* 遅延読み込みするコンポーネント */}
        <Suspense fallback={<LoadingFallback />}>
          <div id="products" className="snap-start min-h-screen">
            <Products />
          </div>
        </Suspense>

        <Suspense fallback={<LoadingFallback />}>
          <div id="services" className="snap-start min-h-screen">
            <Services />
          </div>
        </Suspense>

        <Suspense fallback={<LoadingFallback />}>
          <div id="about" className="snap-start min-h-screen">
            <About />
          </div>
        </Suspense>

        <Suspense fallback={<LoadingFallback />}>
          <div id="company" className="snap-start min-h-screen">
            <Company />
          </div>
        </Suspense>

        <Suspense fallback={<LoadingFallback />}>
          <div id="news" className="snap-start min-h-screen">
            <News />
          </div>
        </Suspense>

        <Suspense fallback={<LoadingFallback />}>
          <div id="contact" className="snap-start min-h-screen">
            <Contact />
          </div>
        </Suspense>

        <Suspense fallback={null}>
          <StarsCanvas />
        </Suspense>
      </div>
    </BrowserRouter>
  );
}

export default App;
