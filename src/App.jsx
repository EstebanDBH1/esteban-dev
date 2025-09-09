import React, { useEffect } from "react";
import CharReveal from "./components/charReveal";
import TextReveal from "./components/textReveal";
import AnimatedText from "./components/animate-text";

const App = () => {
  useEffect(() => {
    document.body.style.opacity = 1;
  }, []);

  return (
    <>
      <div className=" max-w-[1080px] mx-auto p-3  ">
        <div className=" flex flex-col justify-center items-center pb-9">
          {/*   
<AnimatedText text="Esteban" className=" text-7xl  uppercase" />
<AnimatedText text="David" className=" text-7xl uppercase" />
*/}
        </div>
        <TextReveal />
      </div>
    </>
  );
};

export default App;
