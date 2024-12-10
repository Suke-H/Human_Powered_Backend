import React, { useEffect, useRef } from 'react';
import { Message } from '../types';

const Chat = ({
  messages,
  onAuthResponse,
  onChatDrop,
  onFileSaveDragStart,
//   draggedFile,
}: {
  messages: Message[];
  onAuthResponse: (messageId: number, isSuccess: boolean) => void;
  onChatDrop: (e: React.DragEvent<HTMLDivElement>, messageId: number) => void;
  onFileSaveDragStart: (e: React.DragEvent<HTMLDivElement>, fileName: string) => void;
//   draggedFile: File & { path: string[] } | null;
}) => {
  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="w-1/2 bg-white flex flex-col">
      <h2 className="text-xl font-bold p-4 border-b">チャット</h2>
      <div ref={chatContainerRef} className="flex-grow overflow-auto p-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className="p-2 rounded mb-4 bg-gray-100"
            onDrop={(e) => onChatDrop(e, msg.id)}
            onDragOver={(e) => e.preventDefault()}
          >
            <div className="mb-2">
              <strong>
                {msg.sender === 'user' ? 'ユーザー' : 'システム'}:
              </strong>{' '}
              {msg.icon && <span className="mr-2">{msg.icon}</span>}
              {msg.text}
            </div>
            {msg.response && (
              <div className="mt-2 text-sm text-gray-600">
                {msg.responseIcon && <span className="mr-2">{msg.responseIcon}</span>}
                {msg.response}
              </div>
            )}
            <div className="mt-2">
              {msg.type === 'auth' && !msg.response && (
                <>
                  <button
                    onClick={() => onAuthResponse(msg.id, true)}
                    className="mr-2 px-2 py-1 bg-green-500 text-white rounded"
                  >
                    ✅
                  </button>
                  <button
                    onClick={() => onAuthResponse(msg.id, false)}
                    className="px-2 py-1 bg-red-500 text-white rounded"
                  >
                    ❌
                  </button>
                </>
              )}
              {msg.type === 'file_save' && !msg.response && (
                <div
                  draggable
                  onDragStart={(e) => onFileSaveDragStart(e, msg.fileName!)}
                  className="inline-block px-2 py-1 bg-blue-500 text-white rounded cursor-move"
                >
                  {msg.fileName} 📁
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Chat;
