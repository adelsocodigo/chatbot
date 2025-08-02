const { OpenAI } = require('openai');

exports.handler = async (event, context) => {
  // Headers CORS que permiten solicitudes desde cualquier origen (*)
  const corsHeaders = {
    'Access-Control-Allow-Origin': 'https://iachatbot.netlify.app/',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // Manejar solicitudes OPTIONS para CORS preflight
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ message: "CORS preflight" }),
    };
  }

  // Solo aceptar peticiones POST
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Método no permitido" }),
    };
  }

  try {
    const { message } = JSON.parse(event.body);
    
    // Configura OpenAI
    const openai = new OpenAI(process.env.OPENAI_API_KEY);

    // Llamada a la API
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "Eres un asistente de citas. Responde en menos de 50 palabras."
        },
        { role: "user", content: message }
      ],
      max_tokens: 100,
    });

    return {
      statusCode: 200,
      headers: corsHeaders, // Añadir headers aquí
      body: JSON.stringify({ reply: completion.choices[0].message.content }),
    };
  } catch (error) {
    console.error("Error en la función:", error);
    
    return {
      statusCode: 500,
      headers: corsHeaders, // Añadir headers en errores también
      body: JSON.stringify({ 
        error: "Error al procesar la solicitud",
        details: error.message 
      }),
    };
  }
};
