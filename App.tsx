
import React from 'react';
import { JamabandiCalculator } from './components/JamabandiCalculator';
import { KanalMarlaArithmetic } from './components/KanalMarlaArithmetic';
import { FractionArithmetic } from './components/FractionArithmetic';
import { Footer } from './components/ui/Footer';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center p-4 sm:p-6 md:p-8">
      <header className="mb-10 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-sky-400">Haryana Land Calculator</h1>
        <p className="text-slate-400 mt-2 text-lg">Tools for Jamabandi, Kanal/Marla, and Fraction Calculations</p>
      </header>

      <main className="w-full max-w-5xl space-y-12">
        <JamabandiCalculator />
        <KanalMarlaArithmetic />
        <FractionArithmetic />
      </main>
      <Footer />
    </div>
  );
};

export default App;
    