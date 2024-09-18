// src/context/AppContext.js
import React, { createContext, useState } from 'react';

// Create a Context
export const AppContext = createContext();

// Create a Context Provider Component
export const AppProvider = ({ children }) => {
  const [images, setImages] = useState([]);

  return (
    <AppContext.Provider value={{images,setImages}}>
      {children}
    </AppContext.Provider>
  );
};
