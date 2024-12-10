export interface CustomFile {
  type: 'file' | 'image';
  content?: string;
}

export interface Folder {
  [key: string]: CustomFile | Folder;
}

export interface Article {
  id: number;
  likes: number;
}

export interface User {
  id: number;
  userId: string;
  password: string;
  articles: Article[];
}

export interface Message {
  id: number;
  text: string;
  sender: 'user' | 'system';
  icon?: string;
  type: 'auth' | 'file_request' | 'file_save';
  response?: string;
  responseIcon?: string;
  userId?: string;
  password?: string;
  fileName?: string;
}
