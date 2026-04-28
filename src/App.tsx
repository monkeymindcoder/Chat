import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { 
  collection, query, orderBy, limit, onSnapshot, addDoc, 
  serverTimestamp, setDoc, doc, deleteDoc
} from 'firebase/firestore';
import { auth, db, handleFirestoreError } from './lib/firebase';
import { Message, OperationType } from './types';
import Header from './components/Header';
import MessageList from './components/MessageList';
import MessageInput from './components/MessageInput';
import { motion } from 'motion/react';
import { Bot } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState(auth.currentUser);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark';
  });
  
  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);
  
  // Auth & User Sync
  useEffect(() => {
    return onAuthStateChanged(auth, async (fireUser) => {
      setUser(fireUser);
      if (fireUser) {
        const userRef = doc(db, 'users', fireUser.uid);
        try {
          await setDoc(userRef, {
            uid: fireUser.uid,
            displayName: fireUser.displayName,
            email: fireUser.email,
            photoURL: fireUser.photoURL,
            lastActive: serverTimestamp(),
          }, { merge: true });
        } catch (error) {
          console.error("Error syncing user:", error);
        }
      }
      setIsInitialLoad(false);
    });
  }, []);

  // Global Messages Listener
  useEffect(() => {
    if (!user) {
      setMessages([]);
      return;
    }

    const q = query(
      collection(db, 'messages'),
      orderBy('createdAt', 'asc'),
      limit(100)
    );

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const msgs = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Message));
        setMessages(msgs);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'messages');
      }
    );

    return () => unsubscribe();
  }, [user]);

  const handleSendMessage = async (text: string) => {
    if (!user) return;

    try {
      // 1. Save User Message
      const userMessage: Message = {
        text,
        userId: user.uid,
        userName: user.displayName || 'Anonymous',
        userPhoto: user.photoURL,
        createdAt: serverTimestamp(),
        type: 'user'
      };

      await addDoc(collection(db, 'messages'), userMessage);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (!user || !messageId) return;
    try {
      await deleteDoc(doc(db, 'messages', messageId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `messages/${messageId}`);
    }
  };

  if (!user && !isInitialLoad) {
    return (
      <div className={`${isDarkMode ? 'dark' : ''} h-screen`}>
        <div className="flex h-full flex-col bg-[#F5F5F7] transition-colors duration-300 dark:bg-black">
          <Header isDarkMode={isDarkMode} onToggleTheme={() => setIsDarkMode(!isDarkMode)} />
          <div className="flex flex-1 flex-col items-center justify-center px-4 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-8 rounded-[32px] bg-white p-8 shadow-2xl shadow-gray-200 transition-colors duration-300 dark:bg-[#1C1C1E] dark:shadow-none"
            >
              <Bot size={48} className="text-gray-300 dark:text-gray-600" />
            </motion.div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 transition-colors duration-300 dark:text-white">Simply Connect</h2>
            <p className="mt-3 max-w-xs text-gray-500 transition-colors duration-300 dark:text-gray-400">
              Sign in to join the global nexus and chat with everyone in real-time.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${isDarkMode ? 'dark' : ''} h-screen`}>
      <div className="flex h-full flex-col bg-[#F5F5F7] font-sans antialiased text-gray-900 transition-colors duration-300 dark:bg-black dark:text-gray-100">
        <Header isDarkMode={isDarkMode} onToggleTheme={() => setIsDarkMode(!isDarkMode)} />
        
        <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col overflow-hidden bg-white shadow-sm ring-1 ring-gray-100 transition-colors duration-300 sm:my-4 sm:rounded-3xl dark:bg-[#1C1C1E] dark:ring-gray-800">
          <div className="flex-1 overflow-y-auto">
            {messages.length === 0 && !isInitialLoad ? (
              <div className="flex h-full flex-col items-center justify-center p-8 text-center">
                <p className="text-gray-400 dark:text-gray-600">The global chat is quiet. Say something to start the conversation!</p>
              </div>
            ) : (
              <div className="flex flex-col">
                <MessageList 
                  messages={messages} 
                  onDeleteMessage={handleDeleteMessage}
                />
              </div>
            )}
          </div>

          <MessageInput 
            onSendMessage={handleSendMessage} 
            disabled={isInitialLoad}
          />
        </main>
      </div>
    </div>
  );
}

