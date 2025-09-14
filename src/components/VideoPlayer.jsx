import React, { useRef, useState, useEffect, useCallback } from "react";
import gsap from "gsap";

const VideoPlayer = ({ src, title, thumbnail }) => {
  const videoRef = useRef(null);
  const playerContainerRef = useRef(null);
  const progressContainerRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [duration, setDuration] = useState("0:00");
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  // Colores personalizados
  const accentColor = "var(--video-player-accent-color, #22d3ee)"; // Default: cyan-400
  const progressBgColor = "bg-gray-700"; // Fondo de la barra de progreso
  const progressFillColor = "bg-cyan-400"; // Color de relleno de la barra de progreso

  // Formato de tiempo (MM:SS)
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  // Sincronizar el estado de la barra de progreso y el tiempo
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      if (!isScrubbing) {
        const newProgress = (video.currentTime / video.duration) * 100;
        setProgress(newProgress);
        setCurrentTime(formatTime(video.currentTime));
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(formatTime(video.duration));
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, [isScrubbing]);

  // Lógica de mostrar/ocultar controles
  const handleMouseMove = useCallback(() => {
    setShowControls(true);
    if (isPlaying) {
      clearTimeout(window.controlTimeout);
      window.controlTimeout = setTimeout(() => {
        setShowControls(false);
      }, 2500); // Ocultar después de 2.5 segundos de inactividad
    }
  }, [isPlaying]);

  const handleMouseLeave = () => {
    if (isPlaying && !isScrubbing) {
      setShowControls(false);
    }
    clearTimeout(window.controlTimeout);
  };

  // Manejar el "scrubbing" (adelantar/retroceder)
  const handleScrubbing = useCallback((e) => {
    const progressBar = progressContainerRef.current;
    const clickX = e.clientX - progressBar.getBoundingClientRect().left;
    const percent = Math.min(Math.max(0, clickX / progressBar.offsetWidth), 1);

    if (e.buttons === 1 || e.type === "click") {
      // Permitir click directo y arrastre
      videoRef.current.currentTime = percent * videoRef.current.duration;
      setProgress(percent * 100);
    }
  }, []);

  const handleScrubbingStart = useCallback(
    (e) => {
      e.preventDefault(); // Prevenir selección de texto
      setIsScrubbing(true);
      document.addEventListener("mousemove", handleScrubbing);
      document.addEventListener("mouseup", handleScrubbingEnd);
    },
    [handleScrubbing]
  );

  const handleScrubbingEnd = useCallback(() => {
    setIsScrubbing(false);
    document.removeEventListener("mousemove", handleScrubbing);
    document.removeEventListener("mouseup", handleScrubbingEnd);
    handleMouseMove(); // Mostrar controles brevemente después de soltar
  }, [handleMouseMove, handleScrubbing]);

  const togglePlay = () => {
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
      setShowControls(false); // Ocultar controles inmediatamente al empezar a reproducir
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
      setShowControls(true); // Mostrar controles al pausar
    }
  };

  // Animación del botón de play central
  useEffect(() => {
    if (!isPlaying && showControls) {
      // Solo animar si está pausado y los controles son visibles
      gsap.fromTo(
        ".center-play-button",
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(1.7)" }
      );
    } else {
      gsap.to(".center-play-button", {
        opacity: 0,
        scale: 0.8,
        duration: 0.2,
        ease: "power2.in",
      });
    }
  }, [isPlaying, showControls]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      playerContainerRef.current.requestFullscreen().catch((err) => {
        console.error(
          `Error al intentar el modo de pantalla completa: ${err.message}`
        );
      });
    } else {
      document.exitFullscreen();
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value); // Convertir a número flotante
    videoRef.current.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    if (newMutedState) {
      videoRef.current.volume = 0;
    } else {
      videoRef.current.volume = volume; // Restaurar al volumen anterior si no estaba silenciado
    }
  };

  return (
    <div
      ref={playerContainerRef}
      className="relative w-full max-w-4xl mx-auto rounded-xl shadow-2xl overflow-hidden cursor-pointer"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <style>{`
        .range-slider::-webkit-slider-thumb {
          background: ${accentColor};
        }
        .range-slider::-moz-range-thumb {
          background: ${accentColor};
        }
        .range-slider::-ms-thumb {
          background: ${accentColor};
        }
      `}</style>
      <div className="relative pt-[56.25%] bg-black">
        <video
          ref={videoRef}
          src={src}
          className="absolute top-0 left-0 w-full h-full object-cover"
          poster={thumbnail}
          onClick={togglePlay}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => {
            setIsPlaying(false);
            setShowControls(true);
          }}
        />

        {/* Overlay Principal con Controles */}
        <div
          className={`absolute inset-0 flex flex-col justify-between p-6 transition-opacity duration-300 pointer-events-none
            bg-gradient-to-t from-black/80 to-transparent
            ${showControls ? "opacity-100" : "opacity-0"}
          `}
        >
          {/* Título en la parte superior */}
          <h2 className="text-white text-xl md:text-2xl font-bold mb-4 pointer-events-auto">
            {title}
          </h2>

          {/* Botón de Play central, visible cuando no está reproduciendo */}
          {!isPlaying && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto">
              <button
                onClick={togglePlay}
                className="center-play-button p-6 bg-white/30 rounded-full backdrop-blur-md text-white transition-all duration-300 hover:scale-110"
                aria-label={isPlaying ? "Pausar video" : "Reproducir video"}
              >
                <svg
                  className="h-10 w-10 md:h-16 md:w-16"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </button>
            </div>
          )}

          {/* Barra de Controles Inferior */}
          <div className="flex flex-col gap-2 pointer-events-auto">
            {/* Barra de Progreso */}
            <div
              ref={progressContainerRef}
              className={`w-full h-2 ${progressBgColor} rounded-full cursor-pointer relative group`}
              onMouseDown={handleScrubbingStart}
              onClick={handleScrubbing}
            >
              <div
                className={`h-full ${progressFillColor} rounded-full transition-all duration-100`}
                style={{ width: `${progress}%` }}
              ></div>
              <div
                className={`absolute -top-1.5 transform -translate-x-1/2 w-5 h-5 ${progressFillColor} rounded-full border-2 border-white opacity-0 group-hover:opacity-100 transition-opacity duration-200`}
                style={{ left: `${progress}%` }}
              ></div>
            </div>

            {/* Mini-Controles inferiores (Play/Pausa, Tiempo, Volumen, Fullscreen) */}
            <div className="mt-4 flex items-center justify-between text-white">
              <div className="flex items-center gap-4">
                {/* Botón Play/Pausa */}
                <button
                  onClick={togglePlay}
                  className="hover:text-cyan-400 transition-colors"
                >
                  <svg
                    className="w-8 h-8"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {isPlaying ? (
                      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                    ) : (
                      <path d="M8 5v14l11-7z" />
                    )}
                  </svg>
                </button>
                {/* Visualización de Tiempo */}
                <span className="text-sm font-light">
                  {currentTime} / {duration}
                </span>
              </div>

              {/* Controles de Volumen y Pantalla Completa */}
              <div className="flex items-center gap-4">
                {/* Botón de Volumen */}
                <button
                  onClick={toggleMute}
                  className="hover:text-cyan-400 transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {isMuted || volume === 0 ? (
                      <path d="M4 18h2v-6H4v6zm4-12v12h4l5 5V1L12 6H8z" />
                    ) : (
                      <path d="M3 10v4h3l4 4V6l-4 4H3zm12 0c0-2.76-2.24-5-5-5v1.65c2.19 0 4 1.81 4 4.35s-1.81 4-4 4.35V17c2.76 0 5-2.24 5-5z" />
                    )}
                  </svg>
                </button>
                {/* Slider de Volumen */}
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-20 cursor-pointer accent-cyan-400 range-slider" // accent-cyan-400 para el color del input range
                />
                {/* Botón de Pantalla Completa */}
                <button
                  onClick={toggleFullscreen}
                  className="hover:text-cyan-400 transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
