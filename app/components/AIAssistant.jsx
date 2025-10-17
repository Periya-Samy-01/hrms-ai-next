"use client";

import { useState } from 'react';
import { SparklesIcon, XMarkIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
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
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
            <div className="flex flex-col space-y-4">
                <div className="flex items-start">
                    <div className="bg-blue-500 text-white p-3 rounded-lg">
                        <p className="text-sm">Hello! I'm your AI HR Assistant. How can I help you today?</p>
                    </div>
                </div>
            </div>
          </div>
          <div className="p-4 bg-white border-t border-gray-200">
            <div className="flex items-center">
              <input
                type="text"
                placeholder="Type your message..."
                className="flex-1 border-gray-300 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="ml-3 bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700">
                <PaperAirplaneIcon className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}