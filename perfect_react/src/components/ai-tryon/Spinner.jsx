import React from 'react';

const Spinner = () => {
  return (
    <div className="inline-flex items-center justify-center">
      <div className="relative h-16 w-16">
        <div className="absolute inset-0 rounded-full border-4 border-cyan-500/30"></div>
        <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-cyan-400 border-r-cyan-400"></div>
        <div className="absolute inset-2 rounded-full bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 blur-sm"></div>
      </div>
    </div>
  );
};

export default Spinner;
