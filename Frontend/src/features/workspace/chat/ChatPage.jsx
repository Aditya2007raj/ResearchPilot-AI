import React, { useState, useRef, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { ChatMessage } from './components/ChatMessage';
import { SuggestedPrompts } from './components/SuggestedPrompts';
import { useSendMessage } from '../../../lib/hooks';
import { Send } from 'lucide-react';

const SUGGESTED_PROMPTS = [
  'What is the core methodology described?',
  'What are the main findings or results?',
  'What limitations do the authors discuss?',
  'What are the suggested future research directions?'
];

export function ChatPage() {
  const { paperId, onCitationClick, onAddCitation } = useOutletContext();
  const sendMessageMutation = useSendMessage(paperId);

  const [messages, setMessages] = useState([
    {
      id: 'msg-welcome',
      sender: 'ai',
      text: 'Hello! I have indexed this paper in the vector database. Ask me any question, and I will search using RAG and Gemini.',
      confidence: 100,
      citations: []
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const feedEndRef = useRef(null);

  useEffect(() => {
    feedEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (textToSend) => {
    if (!textToSend.trim()) return;

    // Append User Message
    const userMessage = {
      id: `msg-user-${Date.now()}`,
      sender: 'user',
      text: textToSend
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');

    // Send query to FastAPI RAG engine endpoint
    sendMessageMutation.mutate(
      { question: textToSend },
      {
        onSuccess: (response) => {
          const payload = response.data;
          
          // Map sources from RAG engine
          const structuredCitations = (payload.sources || []).map((src, index) => {
            const citeId = src.id || `cite-${Date.now()}-${index}`;
            const citationObj = {
              id: citeId,
              title: 'Source Chunk Fragment',
              authors: `Chunk Index: ${src.chunk_index || index}`,
              source: `Similarity Score: ${src.score || 0.0}`,
              page: src.page || src.page_number || 'N/A',
              confidence: Math.round((payload.confidence || 0.9) * 100),
              snippet: src.preview || 'Grounded source content.'
            };
            
            // Append source to Workspace Layout dynamic references panel
            onAddCitation(citationObj);

            return {
              label: `[Source ${index + 1}]`,
              refId: citeId
            };
          });

          setMessages((prev) => [
            ...prev,
            {
              id: `msg-ai-${Date.now()}`,
              sender: 'ai',
              text: payload.answer,
              confidence: Math.round((payload.confidence || 0.9) * 100),
              citations: structuredCitations
            }
          ]);
        },
        onError: (err) => {
          setMessages((prev) => [
            ...prev,
            {
              id: `msg-ai-err-${Date.now()}`,
              sender: 'ai',
              text: `Error contacting the RAG engine: ${err.response?.data?.detail || err.message || 'Server connection issue'}.`,
              confidence: 0,
              citations: []
            }
          ]);
        }
      }
    );
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSendMessage(inputValue);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] max-w-4xl mx-auto select-none">
      {/* 1. Message Feed Box */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2 pb-6 scroll-smooth">
        {messages.map((msg) => (
          <ChatMessage 
            key={msg.id} 
            message={msg} 
            onCitationClick={onCitationClick} 
          />
        ))}
        {sendMessageMutation.isPending && (
          <div className="flex gap-4 p-4 rounded border border-[var(--border-subtle)] bg-[var(--bg-surface)] items-center">
            <div className="w-8 h-8 rounded-full border-2 border-[var(--accent-indigo)] border-t-transparent animate-spin shrink-0" />
            <span className="text-xs font-mono text-[var(--text-secondary)]">RAG Engine searching sources...</span>
          </div>
        )}
        <div ref={feedEndRef} />
      </div>

      {/* 2. Floating Input & Prompts Control Bar */}
      <div className="border-t border-[var(--border-subtle)] bg-[var(--bg-base)] pt-4 space-y-4 shrink-0">
        <SuggestedPrompts
          prompts={SUGGESTED_PROMPTS}
          onPromptClick={handleSendMessage}
        />

        <form onSubmit={handleFormSubmit} className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Inquire about model parameters, translations, equations..."
            disabled={sendMessageMutation.isPending}
            className="flex-1 text-xs font-sans px-4 py-3 rounded bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-indigo)] focus:border-transparent placeholder:text-[var(--text-muted)] transition-all duration-200 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={sendMessageMutation.isPending}
            className="px-4 py-3 rounded bg-[var(--accent-indigo)] hover:bg-[var(--accent-indigo-hover)] text-white flex items-center justify-center transition-all duration-150 active:scale-95 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-indigo)] disabled:opacity-50"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChatPage;
