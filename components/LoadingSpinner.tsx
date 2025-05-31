
import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center my-10" aria-live="assertive" role="status">
      <div className="w-16 h-16 border-4 border-brand-primary border-t-transparent border-solid rounded-full animate-pulse-fast"></div>
      <p className="mt-3 text-neutral-light text-lg">{message}</p>
    </div>
  );
};