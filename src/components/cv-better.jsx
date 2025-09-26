import React, { useState } from "react";

// Componente principal de la aplicación React
const CvBetter = () => {
  // Estado para el texto del CV del usuario
  const [cvText, setCvText] = useState("");
  // Estado para la respuesta estructurada de la IA
  const [cvAnalysis, setCvAnalysis] = useState(null);
  // Estado para controlar la carga
  const [isLoading, setIsLoading] = useState(false);

  // Estado para mostrar mensajes de error
  const [errorMessage, setErrorMessage] = useState(null);

  // NOTA IMPORTANTE: Reemplaza "" con tu clave de API de Gemini.
  const apiKey = "AIzaSyB8P2GYph0DermD6EiCRbRVXOdbb0_tb6Y";

  // URL de la API para el modelo de texto
  const textApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

  const analyzeCV = async () => {
    if (!apiKey || apiKey === "") {
      setErrorMessage(
        "Por favor, inserta tu clave de API en el código para que la aplicación funcione."
      );
      return;
    }

    if (cvText.trim() === "") {
      setErrorMessage("Por favor, ingresa el texto de tu CV para evaluarlo.");
      return;
    }

    setIsLoading(true);
    setCvAnalysis(null);
    setErrorMessage(null); // Limpiar errores previos

    // Define el prompt del sistema para guiar a la IA.
    const systemPrompt = `Eres el mejor reclutador, un experto adaptable a cualquier campo laboral. Tu tarea es analizar un currículum vitae (CV) que el usuario te proporcionará a continuación. Evalúa en detalle lo que está mal, las deficiencias, y cualquier cosa que esté de más (información superflua, irrelevante, o que pueda ser contraproducente).
    
    Proporciona la retroalimentación en formato JSON, con los siguientes campos y la información contenida en ellos. Por favor, asegúrate de que el formato JSON sea válido y contenga toda la información necesaria:
    
    {
      "analisis": {
        "puntuacion": {
          "valor": "Una puntuación del 1 al 10. Si la puntuación es baja, la retroalimentación debe ser más detallada. Solo incluye el valor numérico.",
          "justificacion": "Una breve justificación concisa para la puntuación, destacando los puntos más importantes."
        },
        "deficiencias": "Una lista de los principales problemas, deficiencias, y cosas que están de más en el CV. Proporciona una lista de puntos, no una frase continua.",
        "sugerencias_palabras_clave": "Una lista de palabras clave relevantes para la industria del CV. Sé lo más preciso que puedas."
      },
      "cv_optimizado": "El CV completo y reescrito, optimizado para ATS. Suprime cualquier parecido a texto redactado por IA. La redacción debe ser lo más humana, natural y fluida posible, como si fuera escrita por un profesional del campo. Elimina cualquier formato especial, manteniéndolo en texto plano con solo saltos de línea y tabulaciones si es necesario. Asegúrate de que las secciones estén claramente marcadas (por ejemplo, Experiencia Laboral, Educación) para la lectura de un ATS."
    }`;

    // Define la carga útil para la llamada a la API.
    const payload = {
      contents: [{ parts: [{ text: cvText }] }],
      systemInstruction: {
        parts: [{ text: systemPrompt }],
      },
      generationConfig: {
        responseMimeType: "application/json",
      },
    };

    try {
      const response = await fetch(textApiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error en la API: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      const rawJson = result?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (rawJson) {
        const parsedJson = JSON.parse(rawJson);
        setCvAnalysis(parsedJson);
      } else {
        setErrorMessage(
          "No se pudo obtener una respuesta válida. Intenta de nuevo."
        );
      }
    } catch (error) {
      console.error("Error al llamar a la API de Gemini:", error);
      setErrorMessage(
        `Hubo un error al analizar el CV. Detalles: ${error.message}.`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 8) return "bg-green-500";
    if (score >= 5) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <div className="bg-gray-800 p-8 rounded-3xl shadow-2xl w-full max-w-4xl">
        <h1 className="text-4xl font-bold text-center text-red-500 mb-2">
          Asistente de CV
        </h1>
        <p className="text-center text-gray-400 mb-8">
          Evalúa y optimiza tu currículum de forma instantánea con inteligencia
          artificial.
        </p>

        {errorMessage && (
          <div className="bg-red-500 text-white p-4 rounded-lg mb-4 text-center">
            {errorMessage}
          </div>
        )}

        {/* Sección de entrada del CV */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-white">
            Pega el texto de tu CV
          </h2>
          <textarea
            className="w-full p-4 rounded-lg bg-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 resize-none mb-4"
            rows="10"
            placeholder="Pega aquí todo el contenido de tu CV para un análisis preciso..."
            value={cvText}
            onChange={(e) => setCvText(e.target.value)}
          ></textarea>

          <button
            className="w-full bg-red-600 hover:bg-red-700 transition-all text-white font-bold py-3 px-6 rounded-lg shadow-lg flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={analyzeCV}
            disabled={isLoading}
          >
            {isLoading ? (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              <span>Analizar y Optimizar CV</span>
            )}
          </button>
        </div>

        {/* Sección de resultados del análisis */}
        {cvAnalysis && (
          <div className="bg-gray-700 p-8 rounded-lg shadow-inner">
            <h2 className="text-3xl font-bold text-red-400 mb-6 text-center">
              Resultados del Análisis
            </h2>

            {/* Evaluación General y Gráfico */}
            <div className="mb-6 p-4 rounded-lg bg-gray-600 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-white">
                  Puntuación de Compatibilidad
                </h3>
                <div className="flex items-center">
                  <span className="text-5xl font-bold mr-2 text-red-300">
                    {cvAnalysis.analisis.puntuacion.valor}
                  </span>
                  <span className="text-2xl text-gray-300">/ 10</span>
                </div>
              </div>
              <div className="w-1/2 bg-gray-500 rounded-full h-8 overflow-hidden">
                <div
                  className={`h-full ${getScoreColor(
                    cvAnalysis.analisis.puntuacion.valor
                  )} transition-all duration-500 ease-in-out`}
                  style={{
                    width: `${cvAnalysis.analisis.puntuacion.valor * 10}%`,
                  }}
                ></div>
              </div>
            </div>

            <p className="mb-6 text-gray-300 text-center">
              {cvAnalysis.analisis.puntuacion.justificacion}
            </p>

            {/* Deficiencias y Palabras Clave */}
            <div className="flex flex-col md:flex-row gap-6 mb-6">
              <div className="w-full md:w-1/2 p-4 rounded-lg bg-gray-600">
                <h3 className="text-xl font-semibold mb-2 text-white">
                  Deficiencias Detectadas
                </h3>
                <ul className="list-disc list-inside text-gray-300">
                  {cvAnalysis.analisis.deficiencias.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="w-full md:w-1/2 p-4 rounded-lg bg-gray-600">
                <h3 className="text-xl font-semibold mb-2 text-white">
                  Sugerencias de Palabras Clave
                </h3>
                <ul className="list-disc list-inside text-gray-300">
                  {cvAnalysis.analisis.sugerencias_palabras_clave.map(
                    (item, index) => (
                      <li key={index}>{item}</li>
                    )
                  )}
                </ul>
              </div>
            </div>

            {/* CV Optimizado */}
            <div className="p-4 rounded-lg bg-gray-600">
              <h3 className="text-xl font-semibold mb-2 text-white">
                CV Optimizado para ATS
              </h3>
              <pre className="text-gray-300 whitespace-pre-wrap font-mono">
                {cvAnalysis.cv_optimizado}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CvBetter;
