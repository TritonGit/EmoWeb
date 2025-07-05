import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Chat() {
  const [messages, setMessages] = useState([
    { sender: 'ai', text: 'Hi there! I’m here to listen. How are you feeling today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);
  const navigate = useNavigate(); // ⬅️ back to home

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

    if (!apiKey) {
      console.error('❌ API key is missing. Check your .env file.');
      setMessages(prev => [...prev, { sender: 'ai', text: 'API key is missing. Please check configuration.' }]);
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          model: 'mistralai/mistral-7b-instruct',
          messages: [
            { role: 'system', content: 'You are a kind and supportive emotional assistant. Reply gently.' },
            ...updatedMessages.map(msg => ({
              role: msg.sender === 'user' ? 'user' : 'assistant',
              content: msg.text
            }))
          ]
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'http://localhost:5173',
            'X-Title': 'Emotional Support Chat'
          }
        }
      );

      const aiReply = res.data.choices[0].message.content;
      setMessages(prev => [...prev, { sender: 'ai', text: aiReply }]);
    } catch (err) {
      console.error('OpenRouter error:', err.response?.data || err.message || err);
      setMessages(prev => [...prev, { sender: 'ai', text: 'Oops! I had trouble replying. Try again later.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-purple-50 flex flex-col p-4 sm:p-6">
      
      {/* ← Back to Home */}
      <button
        onClick={() => navigate('/')}
        className="mb-3 text-sm text-purple-600 hover:underline self-start sm:self-center"
      >
        ← Back to Home
      </button>

      <h2 className="text-2xl sm:text-3xl font-bold text-center text-purple-800 mb-4">
        🤖 Emotional Support Chat
      </h2>

      <div className="flex-1 overflow-y-auto space-y-3 mb-4 max-w-2xl w-full mx-auto px-2 sm:px-0">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`px-4 py-3 rounded-xl max-w-[85%] text-base break-words ${
              msg.sender === 'user'
                ? 'bg-blue-100 self-end ml-auto text-right text-black'
                : 'bg-white shadow self-start text-left text-black'
            }`}
          >
            {msg.text}
          </div>
        ))}
        {loading && (
          <p className="text-gray-400 text-sm text-center animate-pulse">Typing...</p>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="flex flex-col sm:flex-row gap-2 max-w-2xl w-full mx-auto">
        <input
          className="flex-1 p-3 rounded-xl border text-black focus:outline-purple-400"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button
          className="bg-purple-600 text-white px-4 py-2 rounded-xl hover:bg-purple-700 transition disabled:opacity-50"
          onClick={handleSend}
          disabled={loading}
        >
          Send
        </button>
      </div>
    </div>
  );
}
