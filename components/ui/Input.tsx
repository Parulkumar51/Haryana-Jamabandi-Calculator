
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  wrapperClassName?: string;
}

export const Input: React.FC<InputProps> = ({ label, id, wrapperClassName = '', ...props }) => {
  return (
    <div className={wrapperClassName}>
      {label && <label htmlFor={id} className="block text-sm font-medium text-slate-300 mb-1">{label}</label>}
      <input
        id={id}
        {...props}
        className={`w-full px-4 py-2.5 bg-slate-700 border border-slate-600 text-slate-100 rounded-lg shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition duration-150 ease-in-out ${props.className || ''}`}
      />
    </div>
  );
};
    