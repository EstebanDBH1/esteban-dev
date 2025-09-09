import React, { useRef, useState, useEffect } from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { CustomEase } from "gsap/CustomEase";

gsap.registerPlugin(SplitText, CustomEase);

CustomEase.create("primaryCurve", "M0,0 C0.62,0.05 0.01,0.99 1,1");

// Este es el hook personalizado que encapsula la lógica de GSAP.
// Esto es opcional, pero hace el código extremadamente limpio.
const useCharReveal = (ref, text, type) => {
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
      const parrafo = ref.current;
      if (parrafo) {
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
        });

        // gsap.from() hace el "set" de forma interna e instantánea.
        gsap.from(ref.current.querySelectorAll(".inner-content"), {
          yPercent: 100,
          skewY: 1,
          stagger: staggerValue,
          duration: 1.5,
          ease: "primaryCurve",
        });
      }
    }, ref);

    return () => ctx.revert();
  }, [ref, windowSize.width, text]); // Se re-ejecuta si cambian estas dependencias
};

const AnimatedText = ({ text, type = "chars", className = "" }) => {
  const contenedorRef = useRef();
  const parrafoRef = useRef();

  // Llamamos al hook personalizado con las referencias y props.
  useCharReveal(parrafoRef, text, type);

  return (
    <div className={`animated-text-container ${className}`} ref={contenedorRef}>
      <p ref={parrafoRef}>{text}</p>
    </div>
  );
};

export default AnimatedText;
