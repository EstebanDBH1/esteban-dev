import React, { useEffect } from "react";
import CharReveal from "./components/charReveal";
import TextReveal from "./components/textReveal";
import AnimatedText from "./components/animate-text";
import Header from "./components/header";
import Portfolio from "./components/Portfolio";
import VideoPlayer from "./components/VideoPlayer";

const App = () => {
  useEffect(() => {
    document.body.style.opacity = 1;
  }, []);

  return (
    <>
      <main className=" p-5">
        <VideoPlayer
          src="https://www.w3schools.com/html/mov_bbb.mp4" // Reemplaza con la URL de tu video
          title="Un Video Interesante"
          thumbnail="https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg" // Reemplaza con la URL de tu miniatura
        />
      </main>
    </>
  );
};

export default App;
