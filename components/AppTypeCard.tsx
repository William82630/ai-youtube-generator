
import React from 'react';

interface AppTypeCardProps {
  title: string;
}

const CodeIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
    </svg>
);


export const AppTypeCard: React.FC<AppTypeCardProps> = ({ title }) => {
  return (
    <div className="bg-neutral-medium/50 backdrop-blur-sm p-6 rounded-xl shadow-xl hover:shadow-brand-primary/30 transition-all duration-300 ease-in-out transform hover:-translate-y-1 border border-neutral-medium">
      <div className="flex items-center mb-4">
        <CodeIcon className="w-8 h-8 text-brand-primary mr-3" />
        <h3 className="text-xl font-semibold text-neutral-light">{title}</h3>
      </div>
      <p className="text-sm text-neutral-light/80">
        I can design and develop sophisticated {title.toLowerCase()} tailored to your specific needs, ensuring a seamless user experience and robust functionality.
      </p>
    </div>
  );
};
