const chatMessages = document.getElementById('chatMessages');
const messageInput = document.getElementById('messageInput');
        const sendButton = document.getElementById('sendButton');
        const typingIndicator = document.getElementById('typingIndicator');

        const WEBHOOK_URL = 'http://localhost:5678/webhook-test/8f75961e-0ac2-4477-a8e3-a289aefe7057';

        function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message ' + sender;

        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.textContent = sender === 'bot' ? '🤖' : '👤';

        const content = document.createElement('div');
        content.className = 'message-content';
        content.textContent = text;

        messageDiv.appendChild(avatar);
        messageDiv.appendChild(content);

        chatMessages.insertBefore(messageDiv, typingIndicator);
        scrollToBottom();
    }

        function showTyping() {
        typingIndicator.classList.add('active');
        scrollToBottom();
    }

        function hideTyping() {
        typingIndicator.classList.remove('active');
    }

        function scrollToBottom() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

        // 🚀 Send message to your webhook and get a response
// 🚀 Send message to your webhook and get a response
async function callWebhook(userMessage) {
    console.log('➡️ Sending message to webhook:', userMessage);

    try {
        const response = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: userMessage, timestamp: new Date().toISOString() })
        });

        if (!response.ok) {
            const text = await response.text();
            console.error('❌ Non-OK Response:', text);
            throw new Error(`HTTP ${response.status} - ${text}`);
        }

        const data = await response.json();
        console.log('✅ Parsed JSON:', data);

        // ✅ Fixed: Access the nested object property
        const reply = data.object?.choices?.[0]?.message?.content ||
            data.choices?.[0]?.message?.content ||
            '⚠️ No reply received.';
        console.log('💬 Bot reply:', reply);

        return reply;

    } catch (error) {
        console.error('🚨 Webhook Error:', error);
        throw error;
    }
}

async function sendMessage() {
        const text = messageInput.value.trim();
        if (text === '') return;

        messageInput.disabled = true;
        sendButton.disabled = true;

        addMessage(text, 'user');
        messageInput.value = '';

        showTyping();

        try {
        const botResponse = await callWebhook(text);
        hideTyping();
        addMessage(botResponse, 'bot');
    } catch (error) {
        hideTyping();
        addMessage('⚠️ Sorry, something went wrong. Please try again.', 'bot');
    } finally {
        messageInput.disabled = false;
        sendButton.disabled = false;
        messageInput.focus();
    }
    }

        sendButton.addEventListener('click', sendMessage);

        messageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !messageInput.disabled) {
        sendMessage();
    }
    });

        window.addEventListener('load', function() {
        messageInput.focus();
    });
