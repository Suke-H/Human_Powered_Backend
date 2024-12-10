import React from 'react';
import { Folder, CustomFile } from '../types';

const FileExplorer = ({
  fileSystem,
  currentPath,
  onNavigate,
  onFileDragStart,
}: {
  fileSystem: Folder;
  currentPath: string[];
  onNavigate: (newPath: string[]) => void;
  onFileDragStart: (
    e: React.DragEvent<HTMLDivElement>,
    file: CustomFile,
    path: string[]
  ) => void;
}) => {
  const getCurrentFolder = () => {
    return currentPath.reduce(
      (acc: Folder, folder: string) => (acc[folder] as Folder) || {},
      fileSystem
    );
  };

  const renderFileSystem = (fs: Folder, path: string[] = []) => {
    return Object.entries(fs).map(([key, value]) => {
      const fullPath = [...path, key];
      if (value.type === 'file' || value.type === 'image') {
        return (
          <div
            key={key}
            className="ml-4 cursor-move"
            draggable
            onDragStart={(e) => onFileDragStart(e, value as CustomFile, fullPath)}
          >
            {value.type === 'file' ? '📄' : '🖼️'} {key}
          </div>
        );
      } else {
        return (
          <div key={key}>
            <div
              className="ml-4 cursor-pointer"
              onClick={() => onNavigate(fullPath)}
            >
              📁 {key}
            </div>
            {renderFileSystem(value as Folder, fullPath)}
          </div>
        );
      }
    });
  };

  return (
    <div>
      <div className="flex items-center mb-2">
        <button
          onClick={() => onNavigate(currentPath.slice(0, -1))}
          disabled={currentPath.length === 1}
        >
          ←
        </button>
        <span className="ml-2">{currentPath.join(' / ')}</span>
      </div>
      {renderFileSystem(getCurrentFolder(), currentPath)}
    </div>
  );
};

export default FileExplorer;
