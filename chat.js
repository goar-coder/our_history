document.addEventListener('DOMContentLoaded', () => {
    const chatForm = document.getElementById('chatForm');
    const userInput = document.getElementById('userInput');
    const chatBox = document.getElementById('chatBox');

    // WEBHOOK URL - Change this to your actual webhook
    const WEBHOOK_URL = 'https://n8n-initial-n8n.aq8y8p.easypanel.host/webhook-test/59c439d5-bd6d-4634-8acb-b22cb1ad7dc4'

    chatForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const message = userInput.value.trim();
        if (!message) return;

        // Add User Message
        addMessage(message, 'user-message');
        userInput.value = '';
        scrollToBottom();

        // Show Loading/Typing State
        const loadingId = addLoadingIndicator();
        scrollToBottom();

        try {
            // Simulate network delay for better UX (remove this setTimeout in production if real API is fast)
            // Using a real fetch here. If URL is placeholder, it will fail or 404.
            // For demonstration purposes, I will catch the error and show a mock response
            // so the user can see the UI flow.
            
            // To use real webhook: uncomment the fetch below and remove the mock logic
            
            const response = await fetch(WEBHOOK_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: message })
            });

            const data = await response.json();
            const botReply = data.reply || data.message || "Recibido.";
            

             // MOCK RESPONSE SIMULATION (Remove this block when real webhook is ready)
             /*
             await new Promise(resolve => setTimeout(resolve, 1500));
             const botReply = "Gracias por compartir esa parte de tu historia. ¿Qué sentiste en ese momento?";
            */

            removeMessage(loadingId);
            addMessage(botReply, 'bot-message');

        } catch (error) {
            console.error('Error sending message:', error);
            removeMessage(loadingId);
            addMessage("Lo siento, hubo un error al conectar con el agente. Por favor intenta de nuevo.", 'bot-message error');
        }

        scrollToBottom();
    });

    function addMessage(text, className) {
        const msgDiv = document.createElement('div');
        msgDiv.classList.add('message', className);
        msgDiv.textContent = text;
        chatBox.appendChild(msgDiv);
    }

    function addLoadingIndicator() {
        const id = 'loading-' + Date.now();
        const msgDiv = document.createElement('div');
        msgDiv.id = id;
        msgDiv.classList.add('message', 'bot-message', 'loading');
        msgDiv.innerHTML = '<span>.</span><span>.</span><span>.</span>';
        chatBox.appendChild(msgDiv);
        return id;
    }

    function removeMessage(id) {
        const el = document.getElementById(id);
        if (el) el.remove();
    }

    function scrollToBottom() {
        chatBox.scrollTop = chatBox.scrollHeight;
    }
});
