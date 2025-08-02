// script.js
document.getElementById('send-button').addEventListener('click', sendMessage);
document.getElementById('user-input').addEventListener('keypress', function(e) {
  if (e.key === 'Enter') sendMessage();
});

async function sendMessage() {
  const userInput = document.getElementById('user-input').value;
  if (!userInput.trim()) return;

  // Mostrar mensaje del usuario
  displayMessage(userInput, 'user-message');

  // Limpiar input
  document.getElementById('user-input').value = '';

  // Llamar a la API de OpenAI (vía Netlify Function)
  try {
    const response = await fetch('https://https://iachatbot.netlify.app//.netlify/functions/process-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userInput })
    });
    const data = await response.json();
    displayMessage(data.reply, 'bot-message');
  } catch (error) {
    displayMessage('Error al conectar con el asistente. Intenta más tarde.', 'bot-message');
  }
}

function displayMessage(message, className) {
  const chatMessages = document.getElementById('chat-messages');
  const messageElement = document.createElement('div');
  messageElement.classList.add('message', className);
  messageElement.textContent = message;
  chatMessages.appendChild(messageElement);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}