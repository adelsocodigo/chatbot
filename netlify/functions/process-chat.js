const HF_API_KEY = process.env.HF_API_KEY; // Asegúrate de tener esta variable en Netlify

exports.handler = async (event) => {
  // Configuración CORS
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // Manejar preflight OPTIONS
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ message: "Preflight CORS" })
    };
  }

  // Solo aceptar POST
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Método no permitido" })
    };
  }

  try {
    const { message } = JSON.parse(event.body);

    // Llamada a Hugging Face
    const response = await fetch(
      "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1",
      {
        method: "POST",
        headers: { 
          "Authorization": `Bearer ${HF_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
          inputs: `[INST] Eres un asistente de citas. Responde concisamente. Usuario pregunta: ${message} [/INST]`
        })
      }
    );

    if (!response.ok) throw new Error(`Error HF: ${response.statusText}`);

    const data = await response.json();
    const reply = data[0]?.generated_text || "No puedo responder ahora. Intenta más tarde.";

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ reply })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ 
        error: "Error al procesar la solicitud",
        details: error.message 
      })
    };
  }
};