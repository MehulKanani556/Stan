import React from 'react';
import { useLoader } from '../context/LoaderContext';
import Loader from '../Pages/Loader';

const LoaderWrapper = ({ children }) => {
  const { showLoader } = useLoader();

  if (showLoader) {
    return (
      <>
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <Loader />
        </div>
        {children}
      </>
    );
  }

  return children;
};

export default LoaderWrapper;
