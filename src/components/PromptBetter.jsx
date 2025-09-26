import React, { useState } from "react";

// Componente principal de la aplicación React
const PromptBetter = () => {
  // Estado para el prompt del usuario
  const [promptInput, setPromptInput] = useState("");
  // Estado para el prompt mejorado devuelto por la IA
  const [enhancedPrompt, setEnhancedPrompt] = useState("");
  // Estado para controlar el estado de carga (mientras se espera la respuesta de la API)
  const [isLoading, setIsLoading] = useState(false);

  // NOTA IMPORTANTE: Reemplaza "" con tu clave de API de Gemini.
  const apiKey = "AIzaSyB8P2GYph0DermD6EiCRbRVXOdbb0_tb6Y";
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

  const enhancePrompt = async () => {
    // Si la clave API no está configurada, muestra un mensaje y no hace la llamada.
    if (!apiKey || apiKey === "") {
      setEnhancedPrompt(
        "Por favor, inserta tu clave de API en el código para que la aplicación funcione."
      );
      return;
    }

    // Si el campo de texto está vacío, muestra un mensaje de error.
    if (promptInput.trim() === "") {
      setEnhancedPrompt("Por favor, ingresa un prompt para mejorarlo.");
      return;
    }

    // Muestra el estado de carga
    setIsLoading(true);
    setEnhancedPrompt("");

    // Define el prompt del sistema para guiar a la IA.
    const systemPrompt =
      "Eres un experto en ingeniería de prompts. Tu tarea es tomar un prompt de usuario básico y reescribirlo para que sea lo más detallado, específico y efectivo posible. No respondas como un chatbot, solo proporciona el prompt mejorado directamente. Utiliza la estructura y el vocabulario de un prompt profesional, incluyendo el rol, la tarea, el contexto, el formato, etc. Por ejemplo, en lugar de 'escribe un post de blog', transfórmalo en algo como 'Actúa como un copywriter de marketing. Escribe un post de blog de 500 palabras sobre la importancia del SEO para un público de pequeños empresarios. Incluye una lista numerada de 5 puntos clave y un llamado a la acción claro al final.'";

    // Define la carga útil para la llamada a la API.
    const payload = {
      contents: [{ parts: [{ text: promptInput }] }],
      systemInstruction: {
        parts: [{ text: systemPrompt }],
      },
    };

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Error en la API: ${response.statusText}`);
      }

      const result = await response.json();
      const enhancedText =
        result.candidates?.[0]?.content?.parts?.[0]?.text ||
        "No se pudo mejorar el prompt. Intenta de nuevo.";
      setEnhancedPrompt(enhancedText);
    } catch (error) {
      console.error("Error al llamar a la API de Gemini:", error);
      setEnhancedPrompt(
        "Hubo un error al conectar con la IA. Por favor, inténtalo de nuevo más tarde."
      );
    } finally {
      // Oculta el estado de carga, sin importar el resultado.
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <div className="bg-gray-800 p-8 rounded-3xl shadow-2xl w-full max-w-2xl">
        <h1 className="text-4xl font-bold text-center text-red-500 mb-2">
          Mejorador de Prompts con IA
        </h1>
        <p className="text-center text-gray-400 mb-8">
          Obtén prompts detallados y profesionales con la ayuda de la
          inteligencia artificial.
        </p>

        <textarea
          className="w-full p-4 rounded-lg bg-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 resize-none mb-4"
          rows="5"
          placeholder="Escribe tu prompt simple aquí..."
          value={promptInput}
          onChange={(e) => setPromptInput(e.target.value)}
        ></textarea>

        <button
          className="w-full bg-red-600 hover:bg-red-700 transition-all text-white font-bold py-3 px-6 rounded-lg shadow-lg flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={enhancePrompt}
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
            <span>Mejorar Prompt</span>
          )}
        </button>

        {enhancedPrompt && (
          <div className="mt-8 p-6 rounded-lg bg-gray-700 text-gray-300 whitespace-pre-wrap">
            <h3 className="text-xl font-bold mb-2 text-white">
              Prompt Mejorado:
            </h3>
            <p>{enhancedPrompt}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PromptBetter;
