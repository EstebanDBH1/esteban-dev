import React, { useEffect } from "react";
import CharReveal from "./components/charReveal";
import TextReveal from "./components/textReveal";
import AnimatedText from "./components/animate-text";
import Header from "./components/header";

const App = () => {
  useEffect(() => {
    document.body.style.opacity = 1;
  }, []);

  return (
    <>
      <div className=" max-w-[1080px] mx-auto p-3  ">
        <Header />
        <div className=" flex flex-col justify-center items-center pb-9">
          <AnimatedText text="Esteban" className=" text-7xl  uppercase" />
          <AnimatedText text="David" className=" text-7xl uppercase" />
        </div>
      </div>
    </>
  );
};

export default App;
