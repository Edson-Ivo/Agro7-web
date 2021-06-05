import React, { createContext, useCallback, useContext, useState } from 'react';

import Modal from '../components/Modal';

const ModalContext = createContext({});

export const ModalProvider = ({ children }) => {
  const [modal, setModal] = useState();

  const addModal = useCallback(data => {
    setModal(data);
  }, []);

  const removeModal = useCallback(() => {
    setModal(null);
  }, []);

  return (
    <ModalContext.Provider value={{ addModal, removeModal }}>
      {children}
      {modal && <Modal data={modal} />}
    </ModalContext.Provider>
  );
};

export function useModal() {
  const context = useContext(ModalContext);

  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }

  return context;
}
