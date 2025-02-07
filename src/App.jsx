import { BrowserRouter } from "react-router-dom";
import { About, Contact, Experience, Hero, Navbar, Tech, Products, StarsCanvas, Services, Company } from "./components";
import CursorEffect from "./components/CursorEffect";
import InitialLoader from "./components/InitialLoader";

const App = () => {
  return (
    <BrowserRouter>
      <InitialLoader />
      <CursorEffect />
      <div className="relative z-0 bg-primary snap-y snap-mandatory h-screen overflow-y-auto">
        <div className="bg-hero-pattern bg-cover bg-no-repeat bg-center snap-start min-h-screen">
          <Navbar />
          <Hero />
        </div>
        <div className="snap-start min-h-screen">
          <Products />
        </div>
        <div className="snap-start min-h-screen">
          <Services />
        </div>
        <div className="snap-start min-h-screen">
          <About />
        </div>
        <div className="snap-start min-h-screen">
          <Company />
        </div>
        {/* Techセクションを完全に非表示 */}
        {false && (
          <div className="snap-start min-h-screen">
            <Tech isVisible={false} />
          </div>
        )}
        <div className="snap-start min-h-screen">
          <Experience />
        </div>
        <div className="snap-start min-h-screen">
          <Contact />
        </div>
        <StarsCanvas />
      </div>
    </BrowserRouter>
  );
}

export default App;
