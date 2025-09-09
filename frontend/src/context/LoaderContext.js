import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const LoaderContext = createContext();

export const useLoader = () => {
  const context = useContext(LoaderContext);
  if (!context) {
    throw new Error('useLoader must be used within a LoaderProvider');
  }
  return context;
};

export const LoaderProvider = ({ children }) => {
  const [showLoader, setShowLoader] = useState(false);
  const [isFirstVisit, setIsFirstVisit] = useState(false);
  const location = useLocation();
  const isInitialMount = useRef(true);
  const previousPathname = useRef(location.pathname);

  useEffect(() => {
    
    if (location.pathname === '/') {
      
      const hasVisited = localStorage.getItem('hasVisited');
      
      if (!hasVisited) {
        
        setIsFirstVisit(true);
        setShowLoader(true);
        
        
        localStorage.setItem('hasVisited', 'true');
        
        
        const timer = setTimeout(() => {
          setShowLoader(false);
        }, 3000);
        
        return () => clearTimeout(timer);
      } else {
        
        const isPageRefresh = isInitialMount.current || 
          (previousPathname.current === '/' && performance.navigation?.type === 1);
        
        if (isPageRefresh) {
          
          setShowLoader(true);
          
          
          const timer = setTimeout(() => {
            setShowLoader(false);
          }, 3000);
          
          return () => clearTimeout(timer);
        }
      }
    } else {
      setShowLoader(false);
    }
    
    
    previousPathname.current = location.pathname;
    isInitialMount.current = false;
  }, [location.pathname]);

  const hideLoader = () => {
    setShowLoader(false);
  };

  const value = {
    showLoader,
    hideLoader,
    isFirstVisit
  };

  return (
    <LoaderContext.Provider value={value}>
      {children}
    </LoaderContext.Provider>
  );
};
