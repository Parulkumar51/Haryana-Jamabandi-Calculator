
import React from 'react';

interface CardProps {
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ title, children, icon }) => {
  return (
    <section className="bg-slate-800 p-6 sm:p-8 rounded-xl shadow-2xl border border-slate-700">
      <div className="flex items-center mb-6">
        {icon && <div className="mr-3 text-sky-400">{icon}</div>}
        <h2 className="text-2xl sm:text-3xl font-semibold text-sky-400">{title}</h2>
      </div>
      <div className="space-y-6">
        {children}
      </div>
    </section>
  );
};
    