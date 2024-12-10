import React, { useState, useEffect } from "react";
import { Folder, Message, User, CustomFile } from "./types";
import { initialDatabase } from "./data/initialDatabase";
import { initialFileSystem } from "./data/initialFileSystem";
import FileExplorer from "./components/FileExplorer";
import Database from "./components/Database";
import Chat from "./components/Chat";

const App = () => {
  const [database] = useState<User[]>(initialDatabase);
  const [fileSystem, setFileSystem] = useState<Folder>(initialFileSystem);
  const [messages, setMessages] = useState<Message[]>([]);
  const [databaseOpen, setDatabaseOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState<string[]>(["desktop"]);
  const [draggedFile, setDraggedFile] = useState<
    (CustomFile & { path: string[] }) | null
  >(null);

  const generateSampleCredentials = () => {
    const randomUser = database[Math.floor(Math.random() * database.length)];
    const useCorrectPassword = Math.random() < 0.5;
    const password = useCorrectPassword
      ? randomUser.password
      : `wrong${randomUser.password}`;
    return { userId: randomUser.userId, password };
  };

  const sendSampleCredentials = () => {
    const { userId, password } = generateSampleCredentials();
    const message: Message = {
      id: Date.now(),
      text: `userid: ${userId}, パスワード: ${password}`,
      sender: "system",
      icon: "🔑",
      type: "auth",
      userId,
      password,
    };
    setMessages((prev) => [...prev, message]);
  };

  const sendSampleFileRequest = () => {
    const folders = ["desktop", "documents", "images"];
    const randomFolder = folders[Math.floor(Math.random() * folders.length)];
    const message: Message = {
      id: Date.now(),
      text: `${randomFolder}フォルダ内のファイルをドラッグしてください。`,
      sender: "system",
      icon: "📂",
      type: "file_request",
    };
    setMessages((prev) => [...prev, message]);
  };

  const sendSampleFileSave = () => {
    const fileName = `file_${Date.now()}.txt`;
    const message: Message = {
      id: Date.now(),
      text: `${fileName} をdesktopフォルダに保存してください。`,
      sender: "system",
      icon: "💾",
      type: "file_save",
      fileName,
    };
    setMessages((prev) => [...prev, message]);
  };

  const performRandomOperation = () => {
    const operations = [
      sendSampleCredentials,
      sendSampleFileRequest,
      sendSampleFileSave,
    ];
    const randomOperation =
      operations[Math.floor(Math.random() * operations.length)];
    randomOperation();
  };

  useEffect(() => {
    performRandomOperation();
    const interval = setInterval(performRandomOperation, 10000);
    return () => clearInterval(interval);
  }, []);

  const validateUser = (userId: string, password: string) => {
    const user = database.find((u) => u.userId === userId);
    return user && user.password === password;
  };

  const handleAuthResponse = (messageId: number, isSuccess: boolean) => {
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id === messageId) {
          const actualSuccess = validateUser(
            msg.userId || "",
            msg.password || ""
          );
          if (isSuccess === actualSuccess) {
            return {
              ...msg,
              response: `認証結果: ${isSuccess ? "成功" : "失敗"}`,
              responseIcon: isSuccess ? "✅" : "❌",
            };
          } else {
            return {
              ...msg,
              response: `エラー: 実際の認証結果と一致しません。正しい結果は認証${
                actualSuccess ? "成功" : "失敗"
              }です。`,
              responseIcon: "⚠️",
            };
          }
        }
        return msg;
      })
    );
  };

  const handleFileDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    file: CustomFile,
    path: string[]
  ) => {
    setDraggedFile({ ...file, path });
  };

  const handleChatDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    fileName: string
  ) => {
    e.dataTransfer.setData("text/plain", fileName);
  };

  const handleExplorerDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleExplorerDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const fileName = e.dataTransfer.getData("text");
    if (fileName) {
      const newFileSystem = { ...fileSystem };
      let current: Folder = newFileSystem;
      for (const folder of currentPath) {
        if (!(folder in current)) {
          current[folder] = {};
        }
        current = current[folder] as Folder;
      }
      current[fileName] = { type: "file", content: "New file content" };
      setFileSystem(newFileSystem);
      setMessages((prev) =>
        prev.map((msg) => {
          if (msg.type === "file_save" && msg.fileName === fileName) {
            return {
              ...msg,
              response: `ファイル "${fileName}" が ${currentPath.join(
                "/"
              )} に保存されました。`,
              responseIcon: "✅",
            };
          }
          return msg;
        })
      );
    }
  };

  const handleChatDrop = (
    e: React.DragEvent<HTMLDivElement>,
    messageId: number
  ) => {
    e.preventDefault();
    if (draggedFile) {
      setMessages((prev) =>
        prev.map((msg) => {
          if (msg.id === messageId && msg.type === "file_request") {
            return {
              ...msg,
              response: `ファイル "${draggedFile.path.join(
                "/"
              )}" が送信されました。`,
              responseIcon: "✅",
            };
          }
          return msg;
        })
      );
      setDraggedFile(null);
    }
  };

  return (
    <div className="h-screen bg-gray-100 flex flex-col">
      <div className="flex-grow flex overflow-hidden">
        <div
          className="w-1/2 p-4 overflow-auto"
          onDragOver={handleExplorerDragOver}
          onDrop={handleExplorerDrop}
        >
          <FileExplorer
            fileSystem={fileSystem}
            currentPath={currentPath}
            onNavigate={(newPath: string[]) => setCurrentPath(newPath)}
            onFileDragStart={handleFileDragStart}
          />
        </div>
        <Chat
          messages={messages}
          onAuthResponse={handleAuthResponse}
          onChatDrop={handleChatDrop}
          onFileSaveDragStart={handleChatDragStart}
          // draggedFile={draggedFile}
        />
      </div>
      <div className="bg-gray-800 text-white p-2 flex">
        <button onClick={() => setDatabaseOpen(true)} className="mr-2">
          データベース
        </button>
      </div>
      {databaseOpen && (
        <div className="absolute top-20 left-20 w-3/4 h-3/4 bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="bg-gray-200 p-2 flex justify-between items-center">
            <span>データベース</span>
            <button onClick={() => setDatabaseOpen(false)}>×</button>
          </div>
          <div className="p-4 overflow-auto h-full">
            <Database data={database} />
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
