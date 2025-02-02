import { BrowserRouter } from "react-router-dom";

import { About, Contact, Experience, Feedbacks, Hero, Navbar, Tech, Products, StarsCanvas } from "./components";
import CursorEffect from "./components/CursorEffect";

const App = () => {
  return (
    <BrowserRouter>
      <CursorEffect />
      <div className='bg-hero-pattern bg-cover bg-no-repeat bg-center'>
        <Navbar />
        <Hero />
      </div>
      <div className='relative z-0 ocean-gradient wave-effect'>
        <div className="absolute inset-0 bg-[#0052D4]/10 backdrop-blur-[2px] pointer-events-none"></div>
        <Products />
        <About />
        <Experience />
        <Tech />
        <Feedbacks />
        <div className='relative z-0'>
          <Contact />
          <StarsCanvas />
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
