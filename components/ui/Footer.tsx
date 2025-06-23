
import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full max-w-5xl mt-16 py-8 border-t border-slate-700 text-center">
      <p className="text-slate-400 text-sm">
        Haryana Land Calculator &copy; {new Date().getFullYear()}. All calculations are for illustrative purposes.
      </p>
    </footer>
  );
};
    