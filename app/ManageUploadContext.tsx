import React, { createContext, useState, useContext } from 'react';

type UploadContextType = {
  contextUploaded: boolean;
  infoUploaded: boolean;
  contextMessage: string;
  responseInfo: string;
  setContextUploaded: (value: boolean) => void;
  setInfoUploaded: (value: boolean) => void;
  setContextMessage: (value: string) => void;
  setResponseInfo: (value: string) => void;
};

const UploadContext = createContext<UploadContextType | undefined>(undefined);

export const UploadProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [contextUploaded, setContextUploaded] = useState(false);
  const [infoUploaded, setInfoUploaded] = useState(false);
  const [contextMessage, setContextMessage] = useState('');
  const [responseInfo, setResponseInfo] = useState('');

  return (
    <UploadContext.Provider 
      value={{ 
        contextUploaded, 
        infoUploaded, 
        contextMessage,
        responseInfo,
        setContextUploaded, 
        setInfoUploaded,
        setContextMessage,
        setResponseInfo
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