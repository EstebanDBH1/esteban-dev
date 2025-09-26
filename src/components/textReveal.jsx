import React, { useRef, useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { CustomEase } from "gsap/CustomEase";

gsap.registerPlugin(SplitText, CustomEase);

CustomEase.create("myCustomEase", "M0,0 C0.62,0.05 0.01,0.99 1,1");

const TextReveal = () => {
  const contenedorRef = useRef();
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

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

  useGSAP(
    () => {
      const parrafo = contenedorRef.current.querySelector("p");
      if (parrafo) {
        // Revertimos cualquier SplitText anterior y sus animaciones
        if (parrafo.split) {
          parrafo.split.revert();
        }
        // Creamos la instancia de SplitText
        const split = new SplitText(parrafo, {
          type: "lines",
          // Aquí es donde envolvemos cada línea en un div con overflow: hidden
          // SplitText creará un <div> alrededor de cada línea.
          // Por defecto, SplitText ya hace esto, y podemos aplicarle estilos.
          // Alternativamente, puedes usar linesClass para añadir una clase a cada línea.
          linesClass: "line-inner-wrap", // Esta clase se aplicará a cada <div> de línea
        });

        // Guardamos la instancia de split para poder revertirla
        parrafo.split = split;
        // Cada "line-inner-wrap" es un div con la línea de texto.
        // Ahora, queremos que el TEXTO dentro de ese div se mueva.
        // SplitText crea un <div> para cada línea, y dentro de ese <div> está el texto.
        // Por defecto, SplitText NO crea un <div> adicional dentro de la línea para el texto.
        // Para tener un doble wrapper, necesitamos una pequeña manipulación del DOM o CSS.
        // Opción 1: Manipulación manual del DOM para doble wrapper (más control)
        // Esta opción es más robusta si necesitas controlar el elemento interno.
        split.lines.forEach((lineDiv) => {
          const textContent = lineDiv.innerHTML;
          lineDiv.innerHTML = `<div class="line-text-content">${textContent}</div>`;
          lineDiv.style.overflow = "hidden"; // Aquí aplicamos el overflow: hidden al wrapper exterior
        });

        // Animar el contenido del texto dentro de cada línea
        gsap.from(
          contenedorRef.current.querySelectorAll(".line-text-content"),
          {
            yPercent: 100, // Hace que el texto se anime desde abajo DENTRO de su wrapper con overflow: hidden
            stagger: 0.09,
            duration: 0.7,
            ease: "MyCustomEase",
          }
        );
        // Si quieres que las líneas también tengan un pequeño desplazamiento hacia arriba (opcional)
        // gsap.from(split.lines, {
        //   y: 20, // Pequeño movimiento del wrapper de la línea
        //   stagger: 0.1,
        //   duration: 1.2,
        //   ease: "power4.out",
        // });
      }
    },
    { scope: contenedorRef, dependencies: [windowSize.width] }
  );

  return (
    <div
      className="container-reveal"
      ref={contenedorRef}
      // El overflow hidden aquí es para el contenedor general si quieres ocultar todo al principio
      // pero el efecto de máscara por línea se logra con el CSS o JS adicional.
    >
      <p id="txt" className=" leading-[1.2] text-[20px] text-pretty md:text-[40px]  ">
        Hola, mi nombre es Esteban y soy desarrollador web front-end. Soy
        apasionado por la creación de experiencias digitales atractivas y
        funcionales. Me encanta trabajar con tecnologías modernas como React,
        JavaScript y CSS para construir interfaces de usuario dinámicas y
        responsivas.
      </p>
    </div>
  );
};

export default TextReveal;
