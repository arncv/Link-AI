function sendMessage() {
    const message = messageInput.value;
    messageInput.value = '';
  
    const messageEl = document.createElement('div');
    messageEl.className = 'message';
    messageEl.textContent = message;
    chatLog.appendChild(messageEl);
  
    fetch('/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    })
      .then((res) => res.json())
      .then((data) => {
        const reply = data.reply;
        const replyEl = document.createElement('div');
        replyEl.className = 'reply';
        const replyText = document.createElement('p');
        replyText.textContent = reply;
        replyEl.appendChild(replyText);
        chatLog.appendChild(replyEl);
        chatLog.scrollTop = chatLog.scrollHeight;
      });
  }
  