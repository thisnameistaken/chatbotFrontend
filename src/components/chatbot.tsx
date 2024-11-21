import React, { useState } from "react";
import { Message } from "../App";

interface ChatbotProps {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  currentConversationId: string;
}

function Chatbot(chatbotProps: ChatbotProps) {
  const [input, setInput] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  // Send a new message
  function sendMessage() {
    // Update message array with the user message
    chatbotProps.setMessages([
      ...chatbotProps.messages, 
      { id: chatbotProps.messages.length, sender: 'user', text: input }, 
    ]);
    setLoading(true);

    fetch(`${backendUrl}/send_message`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        conversation_id: chatbotProps.currentConversationId,
        text: input,
      })
    })
    .then((res) => res.json())
    .then((data) => chatbotProps.setMessages(data.response))
    .catch((err) => console.error(`Error sending message: ${input}`, err));
    
    setInput(""); // Clear input
    setLoading(false)
  };

  // Delete a message
  function deleteMessage(id: number) {
    fetch(`${backendUrl}/delete_message`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        conversation_id: chatbotProps.currentConversationId,
        message_id: id,
      })
    })
    .then((res) => res.json())
    .then((data) => chatbotProps.setMessages(data.response))
    .catch((err) => console.error(`Error deleting message id ${id}:`, err));
  };

  // Start editing a message
  function startEditing(id: number) {
    const messageToEdit = chatbotProps.messages.find((msg) => msg.id === id);
    if (messageToEdit) {
      setEditingId(id);
      setInput(messageToEdit.text); // Load the message text into the input box
    }
  };

  // Save the edited message
  function saveEditedMessage() {
    if(!editingId) return;

    // Update message array with the user message
    chatbotProps.setMessages([
      ...chatbotProps.messages.slice(0, editingId), 
      { id: chatbotProps.messages.length, sender: 'user', text: input }, 
    ]);
    setLoading(true);

    fetch(`${backendUrl}/update_message`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        conversation_id: chatbotProps.currentConversationId,
        text: input,
        message_id: editingId
      })
    })
    .then((res) => res.json())
    .then((data) => chatbotProps.setMessages(data.response))
    .catch((err) => console.error(`Error editing message id: ${editingId}`, err));
    
    setEditingId(null); // Exit editing mode
    setInput(""); // Clear input
    setLoading(false)
  };

  function cancelEditing() {
    setEditingId(null);
  }

  return (
    <div className="flex-col inset-0 flex h-screen">
      <div className="flex-1 p-4 overflow-y-auto">
        {chatbotProps.messages.map((msg) => (
          <div
            key={String(msg.id)}
            className={`mb-3 flex ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div className="relative">
              {/* Message Bubble */}
              <div
                className={`inline-block px-3 py-2 text-sm rounded-lg ${
                  msg.sender === "user"
                    ? "bg-purple-200 text-purple-800"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {msg.text}
              </div>

              {/* Edit/Delete Buttons for User Messages */}
              {msg.sender === "user" && (
                <div className="absolute right-full mr-2 flex space-x-2">
                  <button
                    onClick={() => startEditing(msg.id)}
                    className="text-xs text-blue-500 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteMessage(msg.id)}
                    className="text-xs text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Input Section */}
      <div className="border-t border-gray-300 p-3 bg-white">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 text-sm p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type your message..."
          />

          {
            loading ? 
            <div className="w-8 h-8 border-4 border-t-4 border-blue-500 rounded-full animate-spin border-solid border-e-transparent"></div>
            : editingId ? (
              <>
              <button
                onClick={saveEditedMessage}
                className="bg-green-500 text-white px-4 py-2 text-sm rounded-lg hover:bg-green-600"
              >
                Save
              </button>
              <button
              onClick={cancelEditing}
              className="bg-blue-500 text-white px-4 py-2 text-sm rounded-lg hover:bg-blue-600"
            >
              Cancel
            </button>
            </>
            ) : (
              <button
                onClick={sendMessage}
                className="bg-blue-500 text-white px-4 py-2 text-sm rounded-lg hover:bg-blue-600"
              >
                Send
              </button>
            )
          }
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
