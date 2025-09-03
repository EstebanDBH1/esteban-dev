import React from "react";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import TextReveal from "./components/textReveal";

const App = () => {
  const contenedor = useRef();
  useGSAP(
    () => {
      gsap.to(".caja", { rotation: 360, x: 100 });
    },
    { scope: contenedor }
  );

  return (
    <>
      <TextReveal />
    </>
  );
};

export default App;
