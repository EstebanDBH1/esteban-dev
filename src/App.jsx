import React, { useEffect } from "react";
import CharReveal from "./components/charReveal";
import TextReveal from "./components/textReveal";
import AnimatedText from "./components/animate-text";
import Header from "./components/header";
import Portfolio from "./components/Portfolio";
import VideoPlayer from "./components/VideoPlayer";
import PromptBetter from "./components/PromptBetter";
import CvBetter from "./components/cv-better";

const App = () => {
  useEffect(() => {
    document.body.style.opacity = 1;
  }, []);

  return (
    <>
      <main className=" max-w-[1000px] mx-auto p-5 flex  flex-col gap-5 ">
        {/*
          <VideoPlayer
            src="https://www.w3schools.com/html/mov_bbb.mp4" // Reemplaza con la URL de tu video
            title="Un Video Interesante"
            thumbnail="https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg" // Reemplaza con la URL de tu miniatura
          />
          */}
        <TextReveal />
      </main>
    </>
  );
};

export default App;
