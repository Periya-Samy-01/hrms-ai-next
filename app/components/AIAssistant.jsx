"use client";

import { useState, useRef, useEffect } from 'react';
import { SparklesIcon, XMarkIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hello! I'm your AI HR Assistant. How can I help you today?", sender: 'ai' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = async () => {
    if (input.trim() === '' || isLoading) return;

    const newMessages = [...messages, { text: input, sender: 'user' }];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: input }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setMessages([...newMessages, { text: data.response, sender: 'ai' }]);
    } catch (error) {
      console.error('Error fetching AI response:', error);
      setMessages([...newMessages, { text: "Sorry, I'm having trouble connecting. Please try again later.", sender: 'ai' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="fixed bottom-8 right-8 z-50">
        <button
          onClick={toggleChat}
          className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-110"
          aria-label="Toggle AI Assistant"
        >
          {isOpen ? <XMarkIcon className="h-8 w-8" /> : <SparklesIcon className="h-8 w-8" />}
        </button>
      </div>

      {isOpen && (
        <div className="fixed bottom-24 right-8 w-96 bg-white rounded-lg shadow-2xl z-50 flex flex-col h-[60vh]">
          <div className="bg-blue-600 text-white p-4 rounded-t-lg flex justify-between items-center">
            <h3 className="font-bold text-lg">HR Assistant</h3>
            <button onClick={toggleChat} className="text-white">
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          <div ref={chatContainerRef} className="flex-1 p-4 overflow-y-auto bg-gray-50">
            <div className="flex flex-col space-y-4">
              {messages.map((msg, index) => (
                <div key={index} className={`flex items-start ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                  <div className={`${msg.sender === 'user' ? 'bg-gray-200 text-black' : 'bg-blue-500 text-white'} p-3 rounded-lg max-w-xs`}>
                    <p className="text-sm">{msg.text}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                 <div className="flex items-start">
                    <div className="bg-blue-500 text-white p-3 rounded-lg">
                        <p className="text-sm">Typing...</p>
                    </div>
                </div>
              )}
            </div>
          </div>
          <div className="p-4 bg-white border-t border-gray-200">
            <div className="flex items-center">
              <input
                type="text"
                placeholder="Type your message..."
                className="flex-1 border-gray-300 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                disabled={isLoading}
              />
              <button
                className="ml-3 bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 disabled:bg-gray-400"
                onClick={handleSendMessage}
                disabled={isLoading}
              >
                <PaperAirplaneIcon className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}