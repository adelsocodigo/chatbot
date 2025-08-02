const { OpenAI } = require('openai');

exports.handler = async (event, context) => {
  // Solo aceptar peticiones POST
  if (event.httpMethod !== 'POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Método no permitido" }),
    };
  }

  try {
    const { message } = JSON.parse(event.body);
    
    // Configura OpenAI
    const openai = new OpenAI(process.env.OPENAI_API_KEY);

    // Llamada a la API
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // Usa este si no tienes acceso a GPT-4
      messages: [
        {
          role: "system",
          content: "Eres un asistente de citas. Responde en menos de 50 palabras."
        },
        { role: "user", content: message }
      ],
      max_tokens: 100, // Limita la respuesta para evitar timeouts
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ reply: completion.choices[0].message.content }),
    };
  } catch (error) {
    // Log del error para Netlify
    console.error("Error en la función:", error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: "Error al procesar la solicitud",
        details: error.message 
      }),
    };
  }
