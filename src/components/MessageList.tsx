import { useEffect, useRef } from 'react';
import { auth } from '../lib/firebase';
import { Message } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface MessageListProps {
  messages: Message[];
  onDeleteMessage?: (id: string) => void;
}

export default function MessageList({ 
  messages, 
  onDeleteMessage, 
}: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div id="message-list" className="flex flex-col gap-6 p-4 sm:p-6">
      <AnimatePresence initial={false}>
        {messages.map((message) => {
          const isMe = message.userId === auth.currentUser?.uid;
          const isAI = message.type === 'ai';
          const canDelete = isMe && onDeleteMessage;

          return (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`flex w-full ${isMe ? 'justify-end' : 'justify-start'} ${isMe ? 'cursor-pointer' : ''}`}
              onClick={() => {
                if (canDelete && message.id) {
                  onDeleteMessage(message.id);
                }
              }}
            >
              <div className={`flex max-w-[85%] items-start gap-3 sm:max-w-[70%] ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                {!isMe && (
                  <img 
                    src={message.userPhoto || `https://api.dicebear.com/7.x/bottts/svg?seed=${isAI ? 'ai' : message.userId}`} 
                    alt={message.userName}
                    className="mt-1 h-8 w-8 shrink-0 rounded-full border border-gray-100 bg-gray-50 dark:border-gray-800 dark:bg-gray-900"
                    referrerPolicy="no-referrer"
                  />
                )}
                
                <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                  {!isMe && (
                    <span className="mb-1 text-[11px] font-medium text-gray-400 uppercase tracking-wider px-1 dark:text-gray-500">
                      {isAI ? 'Gemini AI' : message.userName}
                    </span>
                  )}
                  <div 
                    className={`group relative rounded-2xl px-4 py-2.5 text-sm shadow-sm transition-all
                      ${isMe 
                          ? 'bg-black text-white rounded-tr-none hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-gray-100' 
                          : isAI 
                            ? 'bg-blue-50 text-blue-900 border border-blue-100 rounded-tl-none dark:bg-blue-900/20 dark:text-blue-200 dark:border-blue-900/30' 
                            : 'bg-white text-gray-900 border border-gray-100 rounded-tl-none dark:bg-[#2C2C2E] dark:text-gray-100 dark:border-gray-800'
                      }
                    `}
                  >
                    <p className="whitespace-pre-wrap break-words leading-relaxed">{message.text}</p>
                  </div>
                  <span className="mt-1.5 px-1 text-[10px] text-gray-400 dark:text-gray-500">
                    {message.createdAt?.toDate?.()?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) || 'Just now'}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
      <div ref={bottomRef} />
    </div>
  );
}
