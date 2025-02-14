import React, { useEffect, useState } from "react";
import { styles } from "../styles";
import { navLinks } from "../constants";
import { logo, menu, close } from "../assets";

const Navbar = () => {
  const [active, setActive] = useState("");
  const [toggle, setToggle] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const mainContainer = document.querySelector('.bg-primary');
      if (!mainContainer) return;

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
          if (entry.isIntersecting) {
            // 表示されているセクションを探す
            const activeSection = sections.find(section => 
              section.elements.some(element => element === entry.target)
            );
            if (activeSection) {
              setActive(activeSection.title);
            }
          }
        });
      }, {
        root: mainContainer,
        threshold: 0.5
      });

      // すべてのセクション要素を監視
      sections.forEach(section => {
        section.elements.forEach(element => {
          observer.observe(element);
        });
      });

      return () => {
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
  }, []);

  const scrollToSection = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="fixed top-0 w-full flex items-center py-5 z-20">
      <div className='w-full flex justify-between items-center max-w-7xl mx-auto'>
        <div
          className='flex items-center gap-2 cursor-pointer'
          onClick={(e) => scrollToSection(e, 'hero')}
        >
          <p className='text-white text-[18px] font-bold'>ÓRCX</p>
        </div>

        <ul className='list-none hidden sm:flex flex-row gap-10'>
          {navLinks.map((nav) => (
            <li
              key={nav.id}
              className={`${
                active === nav.title ? "text-white font-semibold scale-105" : "text-secondary"
              } hover:text-white text-[18px] cursor-pointer transition-all duration-300`}
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
                    active === nav.title ? "text-white font-semibold scale-105" : "text-secondary"
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
