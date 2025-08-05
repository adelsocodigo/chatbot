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
  document.getElementById('user-input').value = '';

  try {
    const response = await fetch('/.netlify/functions/process-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userInput })
    });

    if (!response.ok) throw new Error(await response.text());
    const data = await response.json();
    
    if (data.error) {
      displayMessage(`Error: ${data.details}`, 'bot-message');
    } else {
      displayMessage(data.reply, 'bot-message');
    }
  } catch (error) {
    console.error("Error:", error);
    displayMessage("Error al conectar con el asistente. Recarga la página.", 'bot-message');
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