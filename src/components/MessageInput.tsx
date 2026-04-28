import React, { useState } from 'react';
import { Send, Sparkles } from 'lucide-react';

interface MessageInputProps {
  onSendMessage: (text: string) => void;
  disabled: boolean;
}

export default function MessageInput({ onSendMessage, disabled }: MessageInputProps) {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() && !disabled) {
      onSendMessage(text.trim());
      setText('');
    }
  };

  return (
    <div id="message-input-container" className="border-t border-gray-100 bg-white p-4 sm:p-6 transition-colors duration-300 dark:border-gray-800 dark:bg-[#1C1C1E]">
      <form 
        onSubmit={handleSubmit}
        className="mx-auto flex max-w-5xl items-end gap-2 sm:gap-3"
      >
        <div className="relative flex-1">
          <textarea
            id="chat-textarea"
            rows={1}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            placeholder="Type a message..."
            disabled={disabled}
            className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:border-black focus:outline-none focus:ring-0 disabled:opacity-60 transition-all dark:border-gray-800 dark:bg-gray-900 dark:text-white dark:focus:border-white"
          />
        </div>
        <button
          id="send-button"
          type="submit"
          disabled={!text.trim() || disabled}
          className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-xl bg-black text-white shadow-md transition-all hover:bg-gray-800 disabled:bg-gray-200 disabled:shadow-none dark:bg-white dark:text-black dark:hover:bg-gray-200 dark:disabled:bg-gray-800"
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
}
