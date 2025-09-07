import React, { useRef, useState, useEffect } from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { CustomEase } from "gsap/CustomEase";
import { ScrollTrigger } from "gsap/ScrollTrigger"; // Opcional, si quieres la animación con scroll

gsap.registerPlugin(SplitText, CustomEase, ScrollTrigger);

CustomEase.create("primaryCurve", "M0,0 C0.62,0.05 0.01,0.99 1,1");

// Aceptamos las props `text` y `type` (por defecto "chars").
const AnimatedText = ({ text, type = "chars", className = "" }) => {
  const contenedorRef = useRef();
  const parrafoRef = useRef();
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
      });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    let ctx = gsap.context(() => {
      const parrafo = parrafoRef.current;
      if (parrafo) {
        const split = new SplitText(parrafo, {
          type: type,
        });

        const elementsToAnimate = type === "lines" ? split.lines : split.chars;
        const staggerValue = type === "lines" ? 0.1 : 0.08;

        elementsToAnimate.forEach((el) => {
          const textContent = el.innerHTML;
          el.innerHTML = `<div class="inner-content">${textContent}</div>`;
          el.style.overflow = "hidden";
          if (type === "chars") {
            el.style.display = "inline-block";
          }
        });

        gsap.from(contenedorRef.current.querySelectorAll(".inner-content"), {
          yPercent: 100,
          skewY: 1,
          stagger: staggerValue,
          duration: 1.5,
          ease: "primaryCurve",
        });
      }
    }, [parrafoRef]);

    return () => {
      if (ctx) {
        ctx.revert();
      }
    };
  }, [windowSize.width, text]); // Añadimos `text` como dependencia para re-animar si el texto cambia

  return (
    <div className={`animated-text-container ${className}`} ref={contenedorRef}>
      <p ref={parrafoRef} className=" leading-[0.9]  ">{text}</p>
    </div>
  );
};

export default AnimatedText;
