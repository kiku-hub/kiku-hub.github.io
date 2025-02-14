import { BrowserRouter } from "react-router-dom";
import { About, Contact, News, Hero, Navbar, Products, StarsCanvas, Services, Company } from "./components";
import CursorEffect from "./components/CursorEffect";
import InitialLoader from "./components/InitialLoader";

const App = () => {
  return (
    <BrowserRouter>
      <InitialLoader />
      <CursorEffect />
      <div className="relative z-0 bg-primary snap-y snap-mandatory h-screen overflow-y-auto">
        <div id="hero" className="bg-hero-pattern bg-cover bg-no-repeat bg-center snap-start min-h-screen">
          <Navbar />
          <Hero />
        </div>
        <div id="products" className="snap-start min-h-screen">
          <Products />
        </div>
        <div id="services" className="snap-start min-h-screen">
          <Services />
        </div>
        <div id="about" className="snap-start min-h-screen">
          <About />
        </div>
        <div id="company" className="snap-start min-h-screen">
          <Company />
        </div>
        <div id="news" className="snap-start min-h-screen">
          <News />
        </div>
        <div id="contact" className="snap-start min-h-screen">
          <Contact />
        </div>
        <StarsCanvas />
      </div>
    </BrowserRouter>
  );
}

export default App;
