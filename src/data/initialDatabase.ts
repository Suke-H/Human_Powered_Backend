import { User } from '../types';

export const initialDatabase: User[] = [
  { id: 1, userId: 'user1', password: 'pass1', articles: [{ id: 1, likes: 0 }] },
  { id: 2, userId: 'user2', password: 'pass2', articles: [{ id: 2, likes: 0 }] },
  { id: 3, userId: 'user3', password: 'pass3', articles: [{ id: 3, likes: 0 }] },
  { id: 4, userId: 'user4', password: 'pass4', articles: [{ id: 4, likes: 0 }] },
];
