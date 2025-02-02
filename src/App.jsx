import { BrowserRouter } from "react-router-dom";
import { About, Contact, Experience, Feedbacks, Hero, Navbar, Tech, Products, StarsCanvas, Services } from "./components";
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
        <Products />
        <Services />
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
