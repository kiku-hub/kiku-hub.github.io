import React, { useEffect, useState } from "react";
import { styles } from "../styles";
import { navLinks } from "../constants";
import { menu, close } from "../assets";

const Navbar = () => {
  const [active, setActive] = useState("");
  const [toggle, setToggle] = useState(false);
  const [isHeroVisible, setIsHeroVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const mainContainer = document.querySelector('.bg-primary');
      if (!mainContainer) return;

      const heroSection = document.querySelector('#hero');
      const sections = navLinks.map(nav => {
        // Companyセクションの場合はaboutのIDも含める
        const elements = nav.id === 'about' 
          ? [document.getElementById(nav.id), document.getElementById('company')]
          : [document.getElementById(nav.id)];
        
        return {
          id: nav.id,
          title: nav.title,
          elements: elements.filter(Boolean)
        };
      }).filter(section => section.elements.length > 0);

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.target === heroSection) {
            if (entry.isIntersecting) {
              setIsHeroVisible(true);
              setActive("");
            } else {
              setIsHeroVisible(false);
            }
            return;
          }

          if (entry.isIntersecting && !isHeroVisible) {
            const activeSection = sections.find(section => 
              section.elements.some(element => element === entry.target)
            );
            if (activeSection) {
              setActive(activeSection.title);
            }
          }
        });
      }, {
        root: null,
        threshold: 0.2,
        rootMargin: '-80px 0px -20% 0px'
      });

      if (heroSection) {
        observer.observe(heroSection);
      }

      sections.forEach(section => {
        section.elements.forEach(element => {
          observer.observe(element);
        });
      });

      return () => {
        if (heroSection) {
          observer.unobserve(heroSection);
        }
        sections.forEach(section => {
          section.elements.forEach(element => {
            observer.unobserve(element);
          });
        });
      };
    };

    handleScroll();

    return () => {
      handleScroll()?.();
    };
  }, [isHeroVisible]);

  const scrollToSection = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="fixed top-0 w-full flex items-center py-5 z-20">
      <div className='w-full flex justify-between items-center max-w-7xl mx-auto px-4'>
        <div
          className={`flex items-center gap-2 cursor-pointer transition-all duration-300 ${
            isHeroVisible ? "scale-105" : ""
          } hover:scale-105`}
          onClick={(e) => scrollToSection(e, 'hero')}
        >
          <img
            src="/orcx-logo.png"
            alt="ORCX"
            className="w-8 h-8 object-contain"
          />
          <p className={`text-[18px] font-bold transition-all duration-300 ${
            isHeroVisible ? "text-white" : "text-secondary"
          } hover:text-white`}>ÓRCX</p>
        </div>

        <ul className='list-none hidden sm:flex flex-row gap-10'>
          {navLinks.map((nav) => (
            <li
              key={nav.id}
              className={`${
                active === nav.title 
                  ? "text-white font-semibold scale-105" 
                  : "text-secondary hover:text-white hover:scale-105"
              } text-[18px] cursor-pointer transition-all duration-300`}
              onClick={(e) => scrollToSection(e, nav.id)}
            >
              <a href={`#${nav.id}`}>{nav.title}</a>
            </li>
          ))}
        </ul>

        <div className='sm:hidden flex flex-1 justify-end items-center'>
          <img
            src={toggle ? close : menu}
            alt='menu'
            className='w-[28px] h-[28px] object-contain'
            onClick={() => setToggle(!toggle)}
          />

          <div
            className={`${
              !toggle ? "hidden" : "flex"
            } p-6 absolute top-20 right-0 mx-4 my-2 min-w-[140px] z-10 rounded-xl bg-primary/90 backdrop-blur-sm`}
          >
            <ul className='list-none flex justify-end items-start flex-1 flex-col gap-4'>
              {navLinks.map((nav) => (
                <li
                  key={nav.id}
                  className={`font-poppins cursor-pointer text-[16px] ${
                    active === nav.title 
                      ? "text-white font-semibold scale-105" 
                      : "text-secondary hover:text-white hover:scale-105"
                  } transition-all duration-300`}
                  onClick={(e) => {
                    setToggle(!toggle);
                    scrollToSection(e, nav.id);
                  }}
                >
                  <a href={`#${nav.id}`}>{nav.title}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
