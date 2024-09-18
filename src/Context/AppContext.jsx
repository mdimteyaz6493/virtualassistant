// src/context/AppContext.js
import React, { createContext, useState } from 'react';

// Create a Context
export const AppContext = createContext();

// Create a Context Provider Component
export const AppProvider = ({ children }) => {
  const [openModal, setopenModal] = useState(false);
  const [openMenu, setopenMenu] = useState(false)

  return (
    <AppContext.Provider value={{openModal,setopenModal,openMenu,setopenMenu}}>
      {children}
    </AppContext.Provider>
  );
};
