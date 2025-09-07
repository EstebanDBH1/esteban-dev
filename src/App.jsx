import React from "react";
import CharReveal from "./components/charReveal";
import TextReveal from "./components/textReveal";
import AnimatedText from "./components/animate-text";

const App = () => {
  return (
    <>
      <div className=" max-w-[1080px] mx-auto p-3 border ">
        <div className=" flex flex-col justify-center items-center">
          <AnimatedText text="Frontend" className=" text-5xl  uppercase" />
          <AnimatedText text="Developer" className=" text-5xl uppercase" />
        </div>
      </div>
    </>
  );
};

export default App;
