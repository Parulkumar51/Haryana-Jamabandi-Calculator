
import React, { useState, useCallback } from 'react';
import { Card } from './ui/Card';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { FractionalShareEntry } from '../types';
import { parseFraction, roundToPrecision } from '../utils/math';

const CalculatorIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25V9m7.5 0H12m7.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 6.75h.008v.008H12v-.008Z" />
  </svg>
);

const TrashIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12.56 0c1.153 0 2.24.032 3.287.094M5.25 5.79m0 0a48.667 48.667 0 0 0-2.522A2.71 2.71 0 0 0 1.5 7.764v12.54A4.012 4.012 0 0 0 5.512 24h12.976A4.012 4.012 0 0 0 22.5 20.304V7.764a2.71 2.71 0 0 0-1.228-2.029m0 0A48.253 48.253 0 0 0 18.75 5.79m-13.5 0H12" />
  </svg>
);


export const JamabandiCalculator: React.FC = () => {
  const [kanal, setKanal] = useState<string>('');
  const [marla, setMarla] = useState<string>('');
  const [totalLandFarrad, setTotalLandFarrad] = useState<number | null>(null);
  
  const [fractionalShares, setFractionalShares] = useState<FractionalShareEntry[]>([]);
  const [newFractionStr, setNewFractionStr] = useState<string>('');

  const [sumOfShareValues, setSumOfShareValues] = useState<number | null>(null);
  const [finalRatio, setFinalRatio] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const calculateTotalLand = useCallback(() => {
    setError(null);
    const k = parseInt(kanal) || 0;
    const m = parseInt(marla) || 0;

    if (k < 0 || m < 0) {
      setError("Kanal and Marla must be non-negative.");
      setTotalLandFarrad(null);
      return null;
    }
    
    const total = (k * 20) + m;
    setTotalLandFarrad(total);
    return total;
  }, [kanal, marla]);

  const addFractionalShare = () => {
    setError(null);
    const parsedFraction = parseFraction(newFractionStr);
    if (!parsedFraction) {
      setError("Invalid fraction format. Use num/den (e.g., 3/10). Denominator cannot be zero.");
      return;
    }
    if (parsedFraction.denominator === 0) {
      setError("Denominator cannot be zero.");
      return;
    }

    setFractionalShares(prev => [...prev, { id: Date.now().toString(), fractionStr: newFractionStr }]);
    setNewFractionStr('');
  };

  const removeFractionalShare = (id: string) => {
    setFractionalShares(prev => prev.filter(share => share.id !== id));
  };

  const calculateSharesAndFinalRatio = useCallback(() => {
    setError(null);
    const currentTotalLand = calculateTotalLand();
    if (currentTotalLand === null || currentTotalLand <= 0) {
      setError(currentTotalLand === 0 ? "Total land (Marala) is zero, cannot calculate shares." : "Calculate Total Land first or ensure it's positive.");
      setSumOfShareValues(null);
      setFinalRatio(null);
      // Clear previous share values if total land is invalid
      setFractionalShares(prevShares => prevShares.map(s => ({ ...s, shareValue: undefined, error: undefined })));
      return;
    }

    let currentSumOfShares = 0;
    const updatedShares = fractionalShares.map(share => {
      const parsed = parseFraction(share.fractionStr);
      if (!parsed || parsed.denominator === 0) {
        return { ...share, error: "Invalid fraction", shareValue: undefined };
      }
      const shareValue = roundToPrecision((currentTotalLand * parsed.numerator) / parsed.denominator, 4);
      currentSumOfShares += shareValue;
      return { ...share, shareValue, error: undefined };
    });

    setFractionalShares(updatedShares);
    setSumOfShareValues(roundToPrecision(currentSumOfShares, 4));
    
    if (currentTotalLand > 0) {
      setFinalRatio(roundToPrecision(currentSumOfShares / currentTotalLand, 6));
    } else {
      setFinalRatio(null);
    }

  }, [calculateTotalLand, fractionalShares]);

  return (
    <Card title="Jamabandi Calculator" icon={<CalculatorIcon />}>
      {error && <p className="text-red-400 bg-red-900/50 p-3 rounded-md text-sm">{error}</p>}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
        <Input label="Kanal" type="number" value={kanal} onChange={e => setKanal(e.target.value)} placeholder="e.g., 10" />
        <Input label="Marla" type="number" value={marla} onChange={e => setMarla(e.target.value)} placeholder="e.g., 5 (optional)" />
      </div>
      <Button onClick={calculateTotalLand} className="w-full md:w-auto">Calculate Total Land</Button>
      
      {totalLandFarrad !== null && (
        <div className="mt-4 p-4 bg-slate-700/50 rounded-lg">
          <p className="text-lg font-semibold">Total Land: <span className="text-sky-400">{totalLandFarrad} Farrad</span></p>
        </div>
      )}

      <div className="mt-6 border-t border-slate-700 pt-6">
        <h3 className="text-xl font-semibold mb-3 text-slate-200">Fractional Shares</h3>
        <div className="flex gap-2 items-end mb-4">
          <Input 
            label="Add Fraction (e.g., 3/10)" 
            value={newFractionStr} 
            onChange={e => setNewFractionStr(e.target.value)}
            placeholder="Numerator/Denominator"
            wrapperClassName="flex-grow"
          />
          <Button onClick={addFractionalShare} variant="secondary" size="md">Add Share</Button>
        </div>

        {fractionalShares.length > 0 && (
          <div className="space-y-3 mb-4 max-h-60 overflow-y-auto pr-2">
            {fractionalShares.map((share) => (
              <div key={share.id} className="flex items-center justify-between p-3 bg-slate-700 rounded-md">
                <span className="text-slate-300">Fraction: {share.fractionStr}</span>
                {share.error && <span className="text-red-400 text-xs">{share.error}</span>}
                {share.shareValue !== undefined && <span className="text-sky-300 font-medium">{share.shareValue} Farrad</span>}
                <Button onClick={() => removeFractionalShare(share.id)} variant="danger" size="sm" className="px-2 py-1"><TrashIcon/></Button>
              </div>
            ))}
          </div>
        )}
        
        {fractionalShares.length > 0 && (
          <Button onClick={calculateSharesAndFinalRatio} className="w-full md:w-auto">Calculate All Shares & Final Ratio</Button>
        )}
      </div>

      {(sumOfShareValues !== null || finalRatio !== null) && (
        <div className="mt-6 border-t border-slate-700 pt-6 space-y-2">
          {sumOfShareValues !== null && (
            <p className="text-lg">Sum of Share Values: <span className="font-semibold text-sky-400">{sumOfShareValues} Farrad</span></p>
          )}
          {finalRatio !== null && (
            <p className="text-lg">Final Ratio (Sum of Shares / Total Land): <span className="font-semibold text-sky-400">{finalRatio}</span></p>
          )}
        </div>
      )}
    </Card>
  );
};
    