
import React, { useState, useCallback } from 'react';
import { Card } from './ui/Card';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { Select } from './ui/Select';
import { FractionOperationEntry } from '../types';
import { parseFraction, addFractions, subtractFractions, roundToPrecision } from '../utils/math';

const CogIcon: React.FC = () => (
 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" /> {/* Simple up/down arrow to represent operations */}
</svg>
);

const TrashIconSmall: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12.56 0c1.153 0 2.24.032 3.287.094M5.25 5.79m0 0a48.667 48.667 0 0 0-2.522A2.71 2.71 0 0 0 1.5 7.764v12.54A4.012 4.012 0 0 0 5.512 24h12.976A4.012 4.012 0 0 0 22.5 20.304V7.764a2.71 2.71 0 0 0-1.228-2.029m0 0A48.253 48.253 0 0 0 18.75 5.79m-13.5 0H12" />
  </svg>
);


export const FractionArithmetic: React.FC = () => {
  const [operations, setOperations] = useState<FractionOperationEntry[]>([]);
  const [currentFraction1Str, setCurrentFraction1Str] = useState<string>('');
  const [currentFraction2Str, setCurrentFraction2Str] = useState<string>('');
  const [currentOperator, setCurrentOperator] = useState<'+' | '-'>('+');
  const [formError, setFormError] = useState<string | null>(null);

  const operatorOptions = [
    { value: '+', label: 'Addition (+)' },
    { value: '-', label: 'Subtraction (-)' },
  ];

  const handleAddOperation = useCallback(() => {
    setFormError(null);
    const f1 = parseFraction(currentFraction1Str);
    const f2 = parseFraction(currentFraction2Str);

    if (!f1) {
      setFormError("First fraction is invalid. Use num/den format.");
      return;
    }
    if (!f2) {
      setFormError("Second fraction is invalid. Use num/den format.");
      return;
    }
     if (f1.denominator === 0 || f2.denominator === 0) {
      setFormError("Fraction denominator cannot be zero.");
      return;
    }

    try {
      const resultFraction = currentOperator === '+' ? addFractions(f1, f2) : subtractFractions(f1, f2);
      const decimalValue = resultFraction.denominator === 0 ? NaN : resultFraction.numerator / resultFraction.denominator;
      
      const newOperation: FractionOperationEntry = {
        id: Date.now().toString(),
        fraction1Str: currentFraction1Str,
        fraction2Str: currentFraction2Str,
        operator: currentOperator,
        result: {
          fraction: `${resultFraction.numerator}/${resultFraction.denominator}`,
          decimal: roundToPrecision(decimalValue, 4),
          percentage: `${roundToPrecision(decimalValue * 100, 2)}%`,
        },
      };
      setOperations(prev => [newOperation, ...prev]); // Add to top for visibility
      setCurrentFraction1Str('');
      setCurrentFraction2Str('');
    } catch (e: any) {
       setFormError(e.message || "Error performing calculation.");
    }

  }, [currentFraction1Str, currentFraction2Str, currentOperator]);

  const removeOperation = (id: string) => {
    setOperations(prev => prev.filter(op => op.id !== id));
  };

  return (
    <Card title="Fraction Arithmetic" icon={<CogIcon />}>
      <p className="text-slate-300 text-sm mb-4">Add or subtract fractions. Results are simplified and shown as fraction, decimal, and percentage.</p>
      
      {formError && <p className="text-red-400 bg-red-900/50 p-3 rounded-md text-sm mb-4">{formError}</p>}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end p-4 bg-slate-700/30 rounded-lg mb-6">
        <Input 
          label="Fraction 1" 
          value={currentFraction1Str} 
          onChange={e => setCurrentFraction1Str(e.target.value)} 
          placeholder="e.g., 1/10"
        />
        <Select 
          label="Operator"
          options={operatorOptions}
          value={currentOperator}
          onChange={e => setCurrentOperator(e.target.value as '+' | '-')}
        />
        <Input 
          label="Fraction 2" 
          value={currentFraction2Str} 
          onChange={e => setCurrentFraction2Str(e.target.value)} 
          placeholder="e.g., 1/30"
        />
        <Button onClick={handleAddOperation} className="w-full h-[46px]">Add Operation</Button>
      </div>
      
      {operations.length > 0 && (
        <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
          <h3 className="text-xl font-semibold text-slate-200 mb-2">Calculation History</h3>
          {operations.map(op => (
            <div key={op.id} className="p-4 bg-slate-700 rounded-lg shadow">
              <div className="flex justify-between items-start">
                <p className="text-slate-300 text-lg mb-1">
                  {op.fraction1Str} <span className="text-sky-400 font-bold text-xl mx-1">{op.operator}</span> {op.fraction2Str}
                </p>
                <Button onClick={() => removeOperation(op.id)} variant="danger" size="sm" className="p-1.5"><TrashIconSmall/></Button>
              </div>
              {op.error && <p className="text-red-400 text-sm">{op.error}</p>}
              {op.result && (
                <div className="text-sky-300">
                  Result: <span className="font-semibold text-sky-200">{op.result.fraction}</span> 
                  <span className="text-slate-400 text-sm"> ({op.result.decimal} / {op.result.percentage})</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      {operations.length === 0 && (
         <p className="text-slate-400 text-center py-4">No operations added yet.</p>
      )}
    </Card>
  );
};
    