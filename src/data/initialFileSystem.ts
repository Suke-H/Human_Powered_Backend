import { Folder } from '../types';

export const initialFileSystem: Folder = {
  desktop: {
    documents: {
      'document1.txt': { type: 'file', content: 'This is document 1' },
      'document2.txt': { type: 'file', content: 'This is document 2' },
    },
    images: {
      'image1.jpg': { type: 'image' },
      'image2.png': { type: 'image' },
    },
  },
};
