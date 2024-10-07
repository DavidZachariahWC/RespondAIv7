import React, { createContext, useState, useContext, useCallback } from 'react';

type UploadContextType = {
  contextUploaded: boolean;
  infoUploaded: boolean;
  contextMessage: string;
  responseInfo: string;
  setContextUploaded: (value: boolean) => void;
  setInfoUploaded: (value: boolean) => void;
  setContextMessage: (value: string) => void;
  setResponseInfo: (value: string) => void;
  clearContext: () => void;
  clearResponseInfo: () => void;
};

const UploadContext = createContext<UploadContextType | undefined>(undefined);

export const UploadProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [contextUploaded, setContextUploaded] = useState(false);
  const [infoUploaded, setInfoUploaded] = useState(false);
  const [contextMessage, setContextMessage] = useState('');
  const [responseInfo, setResponseInfo] = useState('');

  const clearContext = useCallback(() => {
    setContextUploaded(false);
    setContextMessage('');
  }, []);

  const clearResponseInfo = useCallback(() => {
    setInfoUploaded(false);
    setResponseInfo('');
  }, []);

  const value = {
    contextUploaded,
    infoUploaded,
    contextMessage,
    responseInfo,
    setContextUploaded,
    setInfoUploaded,
    setContextMessage,
    setResponseInfo,
    clearContext,
    clearResponseInfo
  };

  return (
    <UploadContext.Provider value={value}>
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