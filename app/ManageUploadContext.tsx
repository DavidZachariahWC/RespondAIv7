import React, { createContext, useState, useContext } from 'react';

type UploadContextType = {
  contextUploaded: boolean;
  infoUploaded: boolean;
  setContextUploaded: (value: boolean) => void;
  setInfoUploaded: (value: boolean) => void;
};

const UploadContext = createContext<UploadContextType | undefined>(undefined);

export const UploadProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [contextUploaded, setContextUploaded] = useState(false);
  const [infoUploaded, setInfoUploaded] = useState(false);

  return (
    <UploadContext.Provider 
      value={{ 
        contextUploaded, 
        infoUploaded, 
        setContextUploaded, 
        setInfoUploaded
      }}
    >
      {children}
    </UploadContext.Provider>
  );
};

export const useUpload = () => {
  const context = useContext(UploadContext);
  if (context === undefined) {
    throw new Error('useUpload must be used within a UploadProvider');
  }
  return context;
};