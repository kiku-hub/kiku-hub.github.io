import { BrowserRouter } from "react-router-dom";
import { About, Contact, Experience, Member, Hero, Navbar, Tech, Products, StarsCanvas, Services } from "./components";
import CursorEffect from "./components/CursorEffect";
import InitialLoader from "./components/InitialLoader";

const App = () => {
  return (
    <BrowserRouter>
      <InitialLoader />
      <CursorEffect />
      <div className='bg-hero-pattern bg-cover bg-no-repeat bg-center'>
        <Navbar />
        <Hero />
      </div>
      <div className='relative'>
        <div className='relative z-0 ocean-gradient'>
          <Products />
          <Services />
          <About />
          <Tech />
          <Member />
          <Experience />
          <Contact />
        </div>
        <StarsCanvas />
      </div>
    </BrowserRouter>
  );
}

export default App;
