import React, { useRef, useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { CustomEase } from "gsap/CustomEase";
// Registramos todos los plugins necesarios.
gsap.registerPlugin(SplitText, CustomEase);

// Definimos y le damos un nombre a tu curva cubic-bezier.
CustomEase.create("primaryCurve", "M0,0 C0.62,0.05 0.01,0.99 1,1");

const CharReveal = () => {
  const contenedorRef = useRef();
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // Escuchamos los cambios en el tamaño de la ventana para hacer la animación responsiva.
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Usamos el hook useGSAP para manejar la animación de forma segura en React.
  useGSAP(
    () => {
      const parrafo = contenedorRef.current.querySelector("p");
      if (parrafo) {
        if (parrafo.split) {
          parrafo.split.revert();
        }

        // LA CLAVE: Dividir por 'chars' en lugar de 'lines'
        const split = new SplitText(parrafo, {
          type: "chars", // ¡Aquí está el cambio!
        });
        parrafo.split = split;

        // Creamos un div con overflow: hidden para CADA CARÁCTER.
        split.chars.forEach((charDiv) => {
          // Iteramos sobre 'split.chars'
          const textContent = charDiv.innerHTML;
          charDiv.innerHTML = `<div class="char-inner-content">${textContent}</div>`;
          charDiv.style.overflow = "hidden";
          // Importante: para que los caracteres no se amontonen,
          // a veces es necesario que el contenedor del caracter sea 'inline-block'.
          charDiv.style.display = "inline-block";
        });

        // Animamos el contenido del texto dentro de los divs de cada carácter.
        gsap.from(
          contenedorRef.current.querySelectorAll(".char-inner-content"),
          {
            yPercent: 100, // Hace que el carácter se mueva desde abajo de su contenedor
            skewY: 2, // Comienza con una escala más pequeña
            stagger: 0.09, // Un 'stagger' mucho más pequeño para caracteres
            duration: 1.5, // Ajustar duración para un efecto de carácter
            ease: "power3.inOut",
          }
        );
      }
    },
    { scope: contenedorRef, dependencies: [windowSize.width] }
  );

  return (
    <div className="container-reveal-chars" ref={contenedorRef}>
      <p className=" uppercase text-5xl font-medium ">Esteban</p>
    </div>
  );
};

export default CharReveal;
