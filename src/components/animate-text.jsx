import React, { useRef, useState, useEffect } from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { CustomEase } from "gsap/CustomEase";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(SplitText, CustomEase, ScrollTrigger);

CustomEase.create("primaryCurve", "M0,0 C0.62,0.05 0.01,0.99 1,1");

const AnimatedText = ({ text, type = "chars", className = "" }) => {
  const contenedorRef = useRef();
  const parrafoRef = useRef();
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    let ctx = gsap.context(() => {
      const parrafo = parrafoRef.current;
      if (parrafo) {
        // Asegúrate de que el contenedor principal esté visible para que SplitText pueda trabajar
        gsap.set(contenedorRef.current, { visibility: "visible", opacity: 1 });
        // Importante: también aseguramos que el párrafo NO tenga inicialmente la clase `animated-text-hidden` en el return.

        const split = new SplitText(parrafo, { type: type });
        const elementsToAnimate = type === "lines" ? split.lines : split.chars;
        const staggerValue = type === "lines" ? 0.1 : 0.08;

        elementsToAnimate.forEach((el) => {
          const textContent = el.innerHTML;
          el.innerHTML = `<div class="inner-content">${textContent}</div>`;
          el.style.overflow = "hidden";
          if (type === "chars") {
            el.style.display = "inline-block";
          }
          // Ocultamos cada elemento individualmente con GSAP.set()
          gsap.set(el.querySelector(".inner-content"), {
            yPercent: 100,
            skewY: 1,
            //opacity: 0,
          });
        });

        // Ahora animamos para revelarlos
        gsap.to(contenedorRef.current.querySelectorAll(".inner-content"), {
          yPercent: 0,
          skewY: 0,
          opacity: 1, // Animamos la opacidad de 0 a 1
          stagger: staggerValue,
          duration: 1.5,
          ease: "primaryCurve",
          delay: 0.3,
          // Si estás usando ScrollTrigger, lo añadirías aquí:
          // scrollTrigger: {
          //   trigger: contenedorRef.current,
          //   start: "top 80%",
          //   toggleActions: "play none none none",
          // }
        });
      }
    }, [parrafoRef]);

    return () => {
      if (ctx) {
        ctx.revert();
      }
    };
  }, [windowSize.width, text]);

  return (
    <div className={`animated-text-container ${className}`} ref={contenedorRef}>
      {/* QUITAMOS la clase animated-text-hidden del H2. 
          GSAP se encargará de establecer el estado inicial y animar.
          El CSS global con `no-js` aún es una buena práctica.
      */}
      <h2 ref={parrafoRef} className="leading-[0.9] ">
        {text}
      </h2>
    </div>
  );
};

export default AnimatedText;
