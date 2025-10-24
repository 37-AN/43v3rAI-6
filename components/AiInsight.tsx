
import React, { useState, useRef, useEffect } from 'react';
import { PaperAirplaneIcon, SparklesIcon } from '@heroicons/react/24/outline';
import type { ChatMessage } from '../types';

interface AiInsightProps {
  messages: ChatMessage[];
  isTyping: boolean;
  error: string | null;
  onSendMessage: (message: string) => void;
}

const TypingIndicator: React.FC = () => (
  <div className="flex items-center space-x-1.5 p-2">
    <div className="w-2 h-2 bg-brand-light rounded-full animate-pulse [animation-delay:-0.3s]"></div>
    <div className="w-2 h-2 bg-brand-light rounded-full animate-pulse [animation-delay:-0.15s]"></div>
    <div className="w-2 h-2 bg-brand-light rounded-full animate-pulse"></div>
  </div>
);

const MessageBubble: React.FC<ChatMessage> = ({ sender, text }) => {
  const isUser = sender === 'user';
  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
       <div className={`max-w-xs md:max-w-md px-4 py-3 rounded-2xl ${isUser ? 'bg-brand-cyan text-brand-primary' : 'bg-brand-accent text-brand-text'}`}>
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{text}</p>
      </div>
    </div>
  );
};

export const AiInsight: React.FC<AiInsightProps> = ({ messages, isTyping, error, onSendMessage }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSendMessage(input);
      setInput('');
    }
  };

  return (
    <div className="flex flex-col flex-grow h-full min-h-0">
      <div className="flex-grow overflow-y-auto pr-2 -mr-2">
        {messages.length === 0 && isTyping ? (
             <div className="flex items-center justify-center h-full">
                <div className="text-center text-brand-light">
                    <SparklesIcon className="h-8 w-8 mx-auto animate-pulse" />
                    <p className="mt-2 text-sm">Generating initial insight...</p>
                </div>
            </div>
        ) : (
            messages.map((msg, index) => <MessageBubble key={index} {...msg} />)
        )}
        {messages.length > 0 && isTyping && (
          <div className="flex justify-start mb-4">
              <div className="bg-brand-accent rounded-2xl px-4 py-3">
                <TypingIndicator />
              </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      {error && (
        <div className="text-brand-red bg-red-900/20 p-3 rounded-lg mt-2 text-sm shrink-0">
          <p><span className="font-semibold">Error:</span> {error}</p>
        </div>
      )}
      <form onSubmit={handleSubmit} className="mt-4 flex items-center space-x-2 shrink-0">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a follow-up question..."
          aria-label="Ask a follow-up question"
          className="flex-grow bg-brand-primary border border-brand-accent rounded-lg py-2 px-3 text-brand-text placeholder-brand-light focus:outline-none focus:ring-2 focus:ring-brand-cyan transition"
          disabled={isTyping}
        />
        <button
          type="submit"
          aria-label="Send message"
          disabled={isTyping || !input.trim()}
          className="bg-brand-cyan text-brand-primary p-2 rounded-lg transition-colors hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <PaperAirplaneIcon className="h-5 w-5" />
        </button>
      </form>
    </div>
  );
};
