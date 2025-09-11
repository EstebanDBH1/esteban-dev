import React, { useEffect } from "react";
import CharReveal from "./components/charReveal";
import TextReveal from "./components/textReveal";
import AnimatedText from "./components/animate-text";
import Header from "./components/header";
import Portfolio from "./components/Portfolio";

const App = () => {
  useEffect(() => {
    document.body.style.opacity = 1;
  }, []);

  return (
    <>
      <main className=" p-5">
        <AnimatedText text="Esteban" className=" text-5xl " />
        <AnimatedText text="Blanco" className=" text-5xl " />
        <TextReveal />
      </main>
    </>
  );
};

export default App;
