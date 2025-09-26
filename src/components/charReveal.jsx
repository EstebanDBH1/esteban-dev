import React, { useRef, useState, useEffect } from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { CustomEase } from "gsap/CustomEase";

gsap.registerPlugin(SplitText, CustomEase);

CustomEase.create("primaryCurve", "M0,0 C0.62,0.05 0.01,0.99 1,1");

const CharReveal = () => {
  const contenedorRef = useRef();
  const parrafoRef = useRef();
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
  });

  // Este useEffect se encarga de la lógica de re-renderizado
  // cuando la pantalla cambia de tamaño.
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
      });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Este useEffect gestiona la animación y sus dependencias.
  useEffect(() => {
    let ctx = gsap.context(() => {
      const parrafo = parrafoRef.current;
      if (parrafo) {
        // La mejor práctica es crear la instancia de SplitText
        // solo si no existe o si ha sido revertida.
        const split = new SplitText(parrafo, {
          type: "chars",
        });

        split.chars.forEach((charDiv) => {
          const textContent = charDiv.innerHTML;
          charDiv.innerHTML = `<div class="char-inner-content">${textContent}</div>`;
          charDiv.style.overflow = "hidden";
          charDiv.style.display = "inline-block";
        });

        gsap.from(
          contenedorRef.current.querySelectorAll(".char-inner-content"),
          {
            yPercent: 100,
            skewY: 1,
            stagger: 0.06,
            duration: 1.5,
            ease: "primaryCurve",
          }
        );
      }
    }, [parrafoRef]);
    // La función de retorno de useEffect se encarga de la limpieza.
    // Esto es lo que soluciona el problema de la lentitud.
    return () => {
      if (ctx) {
        ctx.revert();
      }
    };
  }, [windowSize.width]); // ¡La clave es que la animación se re-cree cuando el ancho cambie!

  return (
    <div className="container-reveal-chars" ref={contenedorRef}>
      <p className="uppercase  text-[10vw] font-medium p" ref={parrafoRef}>
        Esteban
      </p>
    </div>
  );
};

export default CharReveal;
