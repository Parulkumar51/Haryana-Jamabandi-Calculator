
import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: Array<{ value: string; label: string }>;
  wrapperClassName?: string;
}

export const Select: React.FC<SelectProps> = ({ label, id, options, wrapperClassName = '', ...props }) => {
  return (
    <div className={wrapperClassName}>
      {label && <label htmlFor={id} className="block text-sm font-medium text-slate-300 mb-1">{label}</label>}
      <select
        id={id}
        {...props}
        className={`w-full px-4 py-2.5 bg-slate-700 border border-slate-600 text-slate-100 rounded-lg shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition duration-150 ease-in-out appearance-none ${props.className || ''}`}
      >
        {options.map(option => (
          <option key={option.value} value={option.value} className="bg-slate-700 text-slate-100">
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};
    