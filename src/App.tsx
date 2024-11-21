import { useEffect, useState } from 'react';
import Chatbot from './components/chatbot';

function App() {
  const [currentConversationId, setCurrentConversationId] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  function newConversation() {
    fetch(`${backendUrl}/start_conversation`, {
      method: 'POST',
    })
    .then((res) => res.json())
    .then((data) => setCurrentConversationId(data.conversation_id))
    .then(() => setMessages([]))
    .catch((err) => console.error('Error starting conversation:', err));
  }

  useEffect(() => {
    // Initialize a new conversation on load
    newConversation();
  }, []);

  return (
    <div className="h-screen flex flex-col">
      <div className="bg-blue-500 text-white px-4 py-3 flex items-center">
        <h2 className="font-bold text-lg">Sample Chatbot</h2>
        <button 
          onClick={() => newConversation()} 
          className="text-white hover:underline font-bold text-lg ml-auto"
          >
          Reset Conversation
        </button>
      </div>
      <Chatbot messages={messages} setMessages={setMessages} currentConversationId={currentConversationId}/>
    </div>
  );
}

export default App;

export interface Message {
  id: number; 
  sender: string; 
  text: string;
}
